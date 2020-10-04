'use strict';

const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');
const {OS} = ChromeUtils.import('resource://gre/modules/osfile.jsm');

/**
 * load
 * @param win
 */
function load(win) {
    this.win = win;

    this.IETprefs = Components.classes['@mozilla.org/preferences-service;1']
    .getService(Components.interfaces.nsIPrefBranch);

    this.IETnosub = 'None_subject';

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
 * getPredefinedFolder
 * @returns {null}
 */
function getPredefinedFolder() {
    const use_dir = 'extensions.findnow.exportEML_use_dir';
    const dir_path = 'extensions.findnow.exportEML_dir';

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
 * IETopenFPsync
 * @param fp
 * @returns {*}
 * @constructor
 */
function IETopenFPsync(fp) {
    let done = false;
    let rv;

    fp.open(function(result) {
        rv = result;
        done = true;
    });

    var thread = Components.classes['@mozilla.org/thread-manager;1'].getService().currentThread;

    while (!done) {
        thread.processNextEvent(true);
    }

    return rv;
}

/**
 * getMsgDestination
 * @returns {null|*|unresolved|string|undefined}
 */
function getMsgDestination() {
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
        const nsIFilePicker = Components.interfaces.nsIFilePicker;
        const fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);

        fp.init(this.win, '', nsIFilePicker.modeGetFolder);

        if (bfile) {
            fp.displayDirectory = bfile;
        }

        let res = null;

        if (fp.show) {
            res = fp.show();
        } else {
            res = this.IETopenFPsync(fp);
        }

        if (res === nsIFilePicker.returnOK) {
            file = fp.file;
        }
    }

    // create sub dir
    // ---------------------------------------------------------------------

    try {
        if (this.IETprefs.getBoolPref('extensions.findnow.exportEML_use_sub_dir')) {
            //if( bfile.path === file.path ) {
            const subDir = this.IETgetComplexPref('extensions.findnow.exportEML_sub_dir');
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

    if (addTime && this.IETprefs.getIntPref('extensions.findnow.exportEML_filename_format') === 2) {
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

    if (addTime && this.IETprefs.getIntPref('extensions.findnow.exportEML_filename_format') === 2) {
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
        str = str.replace(/[^a-zA-Z0-9\- ]/g, '_');
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

function getSubjectForHdr(hdr, dirPath) {
    const emlNameType = this.IETprefs.getIntPref('extensions.findnow.exportEML_filename_format');
    const mustcorrectname = this.IETprefs.getBoolPref('extensions.findnow.export_filenames_toascii');
    const cutSubject = this.IETprefs.getBoolPref('extensions.findnow.export_cut_subject');
    const cutFileName = this.IETprefs.getBoolPref('extensions.findnow.export_cut_filename');
    const useIsoDate = this.IETprefs.getBoolPref('extensions.findnow.export_filename_useisodate');
    const subMaxLen = cutSubject ? 50 : -1;

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