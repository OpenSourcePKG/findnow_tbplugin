'use strict';

const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');
const {OS} = ChromeUtils.import('resource://gre/modules/osfile.jsm');
const {MailUtils} = ChromeUtils.import("resource:///modules/MailUtils.jsm");
const {MailServices} = ChromeUtils.import("resource:///modules/MailServices.jsm");

/**
 * load
 * @param win
 */
function load(win) {
    this.win = win;

    this.IETprefs = Components.classes['@mozilla.org/preferences-service;1']
        .getService(Components.interfaces.nsIPrefBranch);

    this.IETnosub = 'None_subject';

    this._moveToTrash = this.IETprefs.getBoolPref('extensions.findnow.move_to_trash');

    console.log('Findnow Utils: Load');
}

/**
 * IETgetComplexPref
 * @param prefname
 * @returns {*}
 * @constructor
 */
function IETgetComplexPref(prefname) {
    let value;

    if (this.IETprefs.getStringPref) {
        value = this.IETprefs.getStringPref(prefname);
    } else {
        value = this.IETprefs.getComplexValue(
            prefname, Components.interfaces.nsISupportsString).data;
    }

    return value;
}

/**
 * FNisFileExist
 * @param aFile
 * @returns {boolean|*}
 * @constructor
 */
function FNisFileExist(aFile) {
    try {
        const localFile = Components.classes['@mozilla.org/file/local;1']
            .createInstance(Components.interfaces.nsIFile);

        localFile.initWithPath(aFile);

        return localFile.exists();
    } catch (e) {
        console.log(e);
    }

    return false;
}

/**
 * getPredefinedFolder
 * @returns {null}
 */
function getPredefinedFolder() {
    const use_dir = 'extensions.findnow.export_eml_use_dir';
    const dir_path = 'extensions.findnow.export_eml_dir';

    try {
        if (!this.IETprefs.getBoolPref(use_dir)) {
            return null;
        }
    } catch (e) {
        console.log('Findnow Utils: setting not exist');
        return null;
    }

    try {
        const dirPathValue = this.IETgetComplexPref(dir_path);

        if ((this.IETprefs.getPrefType(dir_path) === 0) || (dirPathValue === '')) {
            return null;
        } else {
            const localFile = Components.classes['@mozilla.org/file/local;1']
            .createInstance(Components.interfaces.nsIFile);

            localFile.initWithPath(dirPathValue);

            if (localFile.exists()) {
                return localFile;
            } else {
                return null;
            }
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

/**
 * getMsgDestination
 * @returns {null|*|unresolved|string|undefined}
 */
async function getMsgDestination() {
    const bfile = this.getPredefinedFolder();

    let file = bfile;
    let showPicker = false;

    if (!bfile) {
        showPicker = true;
    }

    if (!showPicker && !this.IETprefs.getBoolPref('extensions.findnow.export_save_auto_eml')) {
        showPicker = true;
    }

    if (showPicker) {
        const fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

        fp.init(this.win, '', nsIFilePicker.modeGetFolder);

        if (bfile) {
            fp.displayDirectory = bfile;
        }

        let res = await new Promise(resolve => {
            fp.open(resolve);
        });

        if (res === nsIFilePicker.returnOK) {
            file = fp.file;
        }
    }

    // create sub dir
    // ---------------------------------------------------------------------

    try {
        if (this.IETprefs.getBoolPref('extensions.findnow.export_eml_use_sub_dir')) {
            //if( bfile.path === file.path ) {
            const subDir = this.IETgetComplexPref('extensions.findnow.export_eml_sub_dir');
            const subDirDes = OS.Path.join(file.path, subDir);

            try {
                // not work!
                //OS.File.makeDir(subDirDes, {ignoreExisting: true});
                //FileUtils.getDir("ProfD", [subDirDes], true);

                const localFile = Components.classes['@mozilla.org/file/local;1']
                .createInstance(Components.interfaces.nsIFile);

                localFile.initWithPath(subDirDes);

                //if( localFile.exists() ) {
                //localFile.create(localFile.DIRECTORY_TYPE, 0777);
                //}

                if (localFile.exists()) {
                    file = localFile;
                }
            } catch (ex) {
                console.log('Findnow Utils: ' +
                    'call getMsgDestination (sub dir) - error = ');
                console.log(ex);

                return null;
            }
            //}
        }
    } catch (e) {
        console.log(e);
    }

    //----------------------------------------------------------------------

    return file;
}

/**
 * dateInISO
 * @param secs
 * @returns {string}
 */
function dateInISO(secs) {
    const addTime = this.IETprefs.getBoolPref('extensions.findnow.export_filenames_addtime');
    const msgDate = new Date(secs * 1000);
    const msgDate8601 = msgDate.getFullYear();

    let month;
    let day;
    let hours;
    let min;
    let sec;

    if (msgDate.getMonth() < 9) {
        month = '0' + (msgDate.getMonth() + 1);
    } else {
        month = msgDate.getMonth() + 1;
    }

    if (msgDate.getDate() < 10) {
        day = '0' + msgDate.getDate();
    } else {
        day = msgDate.getDate();
    }

    let msgDateIsostring = msgDate8601.toString() + '-' + month.toString() + '-' + day.toString();

    if (addTime && this.IETprefs.getIntPref('extensions.findnow.export_eml_filename_format') === 2) {
        if (msgDate.getHours() < 10) {
            hours = '0' + msgDate.getHours();
        } else {
            hours = msgDate.getHours();
        }

        if (msgDate.getMinutes() < 10) {
            min = '0' + msgDate.getMinutes();
        } else {
            min = msgDate.getMinutes();
        }

        sec = msgDate.getSeconds();

        msgDateIsostring += ' ' + hours.toString() + '-' + min.toString() + '-' + sec.toString();
    }

    return msgDateIsostring;
}

/**
 * dateInSecondsTo8601
 * @param secs
 * @returns {string}
 */
function dateInSecondsTo8601(secs) {
    const addTime = this.IETprefs.getBoolPref('extensions.findnow.export_filenames_addtime');
    const msgDate = new Date(secs * 1000);
    const msgDate8601 = msgDate.getFullYear();

    let month;
    let day;
    let hours;
    let min;

    if (msgDate.getMonth() < 9) {
        month = '0' + (msgDate.getMonth() + 1);
    } else {
        month = msgDate.getMonth() + 1;
    }

    if (msgDate.getDate() < 10) {
        day = '0' + msgDate.getDate();
    } else {
        day = msgDate.getDate();
    }

    let msgDate8601string = msgDate8601.toString() + month.toString() + day.toString();

    if (addTime && this.IETprefs.getIntPref('extensions.findnow.export_eml_filename_format') === 2) {
        if (msgDate.getHours() < 10) {
            hours = '0' + msgDate.getHours();
        } else {
            hours = msgDate.getHours();
        }

        if (msgDate.getMinutes() < 10) {
            min = '0' + msgDate.getMinutes();
        } else {
            min = msgDate.getMinutes();
        }

        msgDate8601string += ' ' + hours.toString() + min.toString();
    }

    return msgDate8601string;
}

/**
 * nametoascii
 * @param str
 * @returns {string|*}
 */
function nametoascii(str) {
    if (!this.IETprefs.getBoolPref('extensions.findnow.export_filenames_toascii')) {
        str = str.replace(/[\x00-\x19]/g, '_');

        return str.replace(/[\/\\:,<>*\?\"\|]/g, '_');
    }

    if (str) {
        //str = str.replace(/[^a-zA-Z0-9ÄäÖöÜüß\- ]/g, '_');
        //str = str.replace(/[<>:"/\|?*]/g, '_');
        str = str.replace(/\n/g," ").replace(/[<>:"/\\|?*\x00-\x1F]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/, x=> x + "_");
    } else {
        str = 'Undefinied_or_empty';
    }

    return str;
}

/**
 * formatNameForSubject
 * @param str
 * @param recipients
 * @returns {*}
 */
function formatNameForSubject(str, recipients) {
    if (recipients) {
        str = str.replace(/\s*\,.+/, '');
    }

    if (str.indexOf('<') > -1) {
        str = str.replace(/\s*<.+>/, '');
    } else {
        str = str.replace(/[@\.]/g, '_');
    }

    return str;
}

/**
 *
 * @param hdr
 * @param dirPath
 * @returns {*}
 */
function getSubjectForHdr(hdr, dirPath) {
    const emlNameType = this.IETprefs.getIntPref('extensions.findnow.export_eml_filename_format');
    const mustcorrectname = this.IETprefs.getBoolPref('extensions.findnow.export_filenames_toascii');
    const cutSubject = this.IETprefs.getBoolPref('extensions.findnow.export_cut_subject');
    const cutFileName = this.IETprefs.getBoolPref('extensions.findnow.export_cut_filename');
    const useIsoDate = this.IETprefs.getBoolPref('extensions.findnow.export_filename_useisodate');
    const subMaxLen = cutSubject ? 50 : -1;

    const useFilenameAbbreviation = this.IETprefs.getBoolPref('extensions.findnow.use_filename_abbreviation');
    const allowEditSubject = this.IETprefs.getBoolPref('extensions.findnow.allow_edit_subject');

    // Subject
    let subj;

    if (hdr.mime2DecodedSubject) {
        subj = hdr.mime2DecodedSubject;

        if (hdr.flags & 0x0010) {
            subj = 'Re_' + subj;
        }
    } else {
        subj = this.IETnosub;
    }

    if( allowEditSubject ) {
        var returns = {
            subject: subj,
            returnsubject: null,
            moveToTrash: this.IETprefs.getBoolPref("extensions.findnow.move_to_trash"),
            resulte: false
        };

        this.win.openDialog("chrome://findnow/content/ui/editsubject.html", "dlg", "modal; center= yes;", returns);

        // Cancel -> exit
        if( !returns.resulte ) {
            return null;
        }

        subj = returns.returnsubject;
        this.FNsetMoveToTrash(returns.moveToTrash);

        //subj = this.win.prompt('Bitte geben Sie ihre Änderung im Betreff an:', subj);

        // canel by subject edit
        if (subj === null) {
            return null;
        }
    }

    if( useFilenameAbbreviation ) {
        const filenameAbbreviation = this.IETprefs.getCharPref('extensions.findnow.filename_abbreviation');

        subj = filenameAbbreviation + " " + subj;
    }

    if (subMaxLen > 0) {
        subj = subj.substring(0, subMaxLen);
    }

    subj = this.nametoascii(subj);

    // Date - Key
    const dateInSec = hdr.dateInSeconds;
    let msgDate8601string;

    if (useIsoDate) {
        msgDate8601string = this.dateInISO(dateInSec);
    } else {
        msgDate8601string = this.dateInSecondsTo8601(dateInSec);
    }

    const key = hdr.messageKey;
    let fname;

    if (emlNameType === 2) {
        let pattern = this.IETprefs.getCharPref('extensions.findnow.export_filename_pattern');

        // Name
        const authName = this.formatNameForSubject(hdr.mime2DecodedAuthor, false);
        const recName = this.formatNameForSubject(hdr.mime2DecodedRecipients, true);

        // Sent of Drafts folder
        const isSentFolder = hdr.folder.flags & 0x0200 || hdr.folder.flags & 0x0400;
        const isSentSubFolder = hdr.folder.URI.indexOf('/Sent/');
        let smartName;

        if (isSentFolder || isSentSubFolder > -1) {
            smartName = recName;
        } else {
            smartName = authName;
        }

        pattern = pattern.replace('%s', subj);
        pattern = pattern.replace('%k', key);
        pattern = pattern.replace('%d', msgDate8601string);
        pattern = pattern.replace('%n', smartName);
        pattern = pattern.replace('%a', authName);
        pattern = pattern.replace('%r', recName);
        pattern = pattern.replace(/-%e/g, '');

        if (this.IETprefs.getBoolPref('extensions.findnow.export_filename_add_prefix')) {
            const prefix = this.IETgetComplexPref('extensions.findnow.export_filename_prefix');

            pattern = prefix + pattern;
        }

        fname = pattern;
    } else {
        fname = msgDate8601string + ' ' + subj + '-' + hdr.messageKey;
    }

    fname = fname.replace(/[\x00-\x1F]/g, '_');

    if (mustcorrectname) {
        fname = this.nametoascii(fname);
    } else {
        fname = fname.replace(/[\/\\:,<>*\?\"\|\']/g, '_');
    }

    if (cutFileName) {
        const maxFN = 249 - dirPath.length;

        if (fname.length > maxFN) {
            fname = fname.substring(0, maxFN);
        }
    }

    return fname;
}

/**
 * IETstr_converter
 * @param str
 * @returns {*}
 * @constructor
 */
function IETstr_converter(str) {
    let convStr;

    try {
        const charset = this.IETprefs.getCharPref('extensions.findnow.export_filename_charset');

        if (charset === '') {
            return str;
        }

        const uConv = Cc['@mozilla.org/intl/scriptableunicodeconverter']
        .createInstance(Ci.nsIScriptableUnicodeConverter);

        uConv.charset = charset;
        convStr = uConv.ConvertFromUnicode(str);
    } catch (e) {
        console.log(e);
        return str;
    }

    return convStr;
}

/**
 * IETescapeBeginningFrom
 * @param data
 * @returns {*}
 * @constructor
 */
function IETescapeBeginningFrom(data) {
    const datacorrected = data.replace(/\nFrom /g, '\n From ');
    return datacorrected;
}

/**
 * IETwriteDataOnDisk
 * @param file
 * @param data
 * @param append
 * @param fname
 * @param time
 * @constructor
 */
function IETwriteDataOnDisk(file, data, append, fname, time) {
    try {
        console.log('call to IETwriteDataOnDisk - file path = ' + file.path);
    } catch (e) {
        console.log('call to IETwriteDataOnDisk - error = ');
        console.log(e);
    }

    var foStream = Cc['@mozilla.org/network/file-output-stream;1']
    .createInstance(Ci.nsIFileOutputStream);

    if (append) {
        if (fname) {
            file.append(fname);
        }

        foStream.init(file, 0x02 | 0x08 | 0x10, 0o664, 0); // write,  create, append
    } else {
        foStream.init(file, 0x02 | 0x08 | 0x20, 0o664, 0); // write, create, truncate
    }

    if (data) {
        foStream.write(data, data.length);
    }

    foStream.close();

    try {
        if (time && this.IETprefs.getBoolPref('extensions.findnow.export_set_filetime')) {
            file.lastModifiedTime = time;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * IETwritestatus
 * @param text
 * @constructor
 */
function IETwritestatus(text) {
    if( typeof this.win.document !== 'undefined' ) {
        const document = this.win.document;

        if (document.getElementById('statusText')) {
            document.getElementById('statusText').setAttribute('label', text);

            const delay = this.IETprefs.getIntPref('extensions.findnow.delay_clean_statusbar');
            const futils = this;

            if (delay > 0) {
                this.win.setTimeout(function() {
                    futils.IETdeletestatus(text);
                }, delay);
            }
        }
    }
}

/**
 * IETdeletestatus
 * @param text
 * @constructor
 */
function IETdeletestatus(text) {
    if( typeof this.win.document !== 'undefined' ) {
        const document = this.win.document;

        if (document.getElementById('statusText').getAttribute('label') === text) {
            document.getElementById('statusText').setAttribute('label', '');
        }
    }
}

/**
 * IETescapeBeginningFrom
 * @param data
 * @returns {*}
 * @constructor
 */
function IETescapeBeginningFrom(data) {
    const datacorrected = data.replace(/\nFrom /g, '\n From ');
    return datacorrected;
}

/**
 * IETcopyStrToClip
 * @param str
 * @constructor
 */
function IETcopyStrToClip(str) {
    const clip = Cc['@mozilla.org/widget/clipboardhelper;1']
    .getService(Ci.nsIClipboardHelper);

    clip.copyString(str);
}

/**
 * FNgetTrashFolderURI
 * @param hdr
 * @returns {*}
 * @constructor
 */
function FNgetTrashFolderURI(hdr) {
    let folder = MailUtils.getExistingFolder(hdr.folder.URI);
    let rootFolder = folder.rootFolder;

    return rootFolder.getFolderWithFlags(Components.interfaces.nsMsgFolderFlags.Trash);
}

/**
 * FNmoveMessage
 * @param msguri
 * @param folderuri
 * @returns {boolean}
 * @constructor
 */
function FNmoveMessage(msguri, folderuri) {
    try {
        const messenger = Components.classes['@mozilla.org/messenger;1'].createInstance()
            .QueryInterface(Components.interfaces.nsIMessenger);

        const msgHdr = messenger.messageServiceFromURI(msguri).messageURIToMsgHdr(msguri);

        if( msgHdr.folder.URI != folderuri ) {
            const folder = MailUtils.getExistingFolder(folderuri);

            if (!folder) {
                console.log('target folder for "' + folderuri + '" not found');
                return false;
            }

            const copyService = MailServices.copy;

            let msgs = Components.classes["@mozilla.org/array;1"]
                .createInstance(Components.interfaces.nsIMutableArray);

            msgs.appendElement(msgHdr, false);

            copyService.CopyMessages(
                msgHdr.folder,
                msgs,
                folder,
                true /* isMove */,
                null/*listener*/,
                null /*msgWindow*/,
                true /* allow undo */
                );

            return true;
        }
        else {
            console('target folder is same source folder: "' + folderuri + '"');
        }
    }
    catch( e ) {
        console.log(e);
    }

    return false;
}

/**
 * FNisMoveToTrash
 * @returns {boolean}
 */
function FNisMoveToTrash() {
    return this._moveToTrash;
}

/**
 * FNsetMoveToTrash
 * @param enable
 */
function FNsetMoveToTrash(enable) {
    this._moveToTrash = enable;
}
