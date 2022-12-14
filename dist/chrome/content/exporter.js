/*
 * This file is provided by
 * Company Pegenau GmbH & Co. KG
 *
 * Info: info@pegenau.de
 * Author: Stefan Werfling (stefan.werfling@pegenau.de)
 *
 * Special thanks to:
 * John Bieling (john@thunderbird.net)
 *
 * Credits:
 * ImportExportTools NG (https://github.com/thundernest/import-export-tools-ng)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG = false;

/**
 * load
 * @param win
 */
function load(win) {
    this.win = win;

    this.IETexported = 0;
    this.IETskipped = 0;
    this.IETabort = false;

    if (DEBUG) {
        console.log('Load Exporter');
    }
}

/**
 * saveTo
 */
async function saveTo() {
    if (DEBUG) {
        console.log('Exporter::SaveTo: SaveTo');
    }

    const selectedMsg = this.win.gFolderDisplay.selectedMessage;
    const msgURI = selectedMsg.folder.getUriForMsg(selectedMsg);

    console.log(msgURI);

    const emlsArray = [];
    emlsArray.push(msgURI);

    const file = await this.win.findnow_utils.getMsgDestination();

    if (file === null) {
        this.win.alert(
            'Bei der Auswahl des Ordners für das Speichern der EMail ist ein ' +
            'Fehler aufgetreten! EMail konnte nicht gespeichert werden.'
        );

        return;
    }

    if (file !== false) {
        this.saveMsgAsEML(
            msgURI,
            file,
            false,
            emlsArray,
            null,
            null,
            false,
            false,
            null,
            null
        );
    } else {
        if (DEBUG) {
            console.log('Exporter::SaveTo: cancel msg destincation by user');
        }
    }
}

/**
 * saveMsgAsEML
 * @param msguri
 * @param file
 * @param append
 * @param uriArray
 * @param hdrArray
 * @param fileArray
 * @param imapFolder
 * @param clipboard
 * @param file2
 * @param msgFolder
 */
function saveMsgAsEML(msguri, file, append, uriArray, hdrArray, fileArray, imapFolder, clipboard, file2, msgFolder) {
    console.log("Exporter: saveMsgAsEML");

    if (file === null) {
        console.log('File is null, msguri: ' + msguri);
        return;
    }

    const exporter = this;
    const document = this.win.document;
    let hdr = null;

    // -------------------------------------------------------------------------------------------

    const myEMLlistner = {

        scriptStream: null,
        emailtext: '',

        QueryInterface: function(iid) {
            if (iid.equals(Ci.nsIStreamListener) ||
                iid.equals(Ci.nsISupports)) {
                return this;
            }

            throw Cr.NS_NOINTERFACE;
        },

        // cleidigh - Handle old/new streamlisteners signatures after TB67
        onStartRequest60: function(aRequest, aContext) {
        },

        onStartRequest68: function(aRequest) {
        },

        onStopRequest60: function(aRequest, aContext, aStatusCode) {
            this.onStopRequest68(aRequest, aStatusCode);
        },

        onStopRequest68: function(aRequest, aStatusCode) {
            let savePath = null;

            try {
                let sub;
                let data;

                this.scriptStream = null;

                if (clipboard) {
                    exporter.win.findnow_utils.IETcopyStrToClip(this.emailtext);
                    return;
                }

                const tags = hdr.getStringProperty('keywords');

                if (tags && this.emailtext.substring(0, 5000).includes('X-Mozilla-Keys')) {
                    this.emailtext = 'X-Mozilla-Keys: ' + tags + '\r\n' + this.emailtext;
                }

                if (append) {
                    if (this.emailtext !== '') {
                        data = this.emailtext + '\n';

                        // Some Imap servers don't add to the message the "From" prologue
                        if (data && !data.match(/^From/)) {
                            const da = new Date;

                            // Mbox format requires that the date in "From" first line is 24 characters long
                            let now = da.toString().substring(0, 24);

                            now = now.replace(da.getFullYear() + ' ', '') + ' ' + da.getFullYear();

                            const prologue = 'From - ' + now + '\n';

                            data = prologue + data;
                        }

                        data = exporter.win.findnow_utils.IETescapeBeginningFrom(data);
                    }

                    const fileClone = file.clone();

                    savePath = fileClone.path;

                    exporter.win.findnow_utils.IETwriteDataOnDisk(fileClone, data, true, null, null);

                    sub = true;
                } else {
                    if (!hdrArray) {
                        sub = exporter.win.findnow_utils.getSubjectForHdr(hdr, file.path);
                    } else {
                        let parts = hdrArray[exporter.IETexported].split('§][§^^§');

                        sub = parts[4];
                        sub = sub.replace(/[\x00-\x1F]/g, '_');
                    }

                    sub = exporter.win.findnow_utils.IETstr_converter(sub);

                    if (sub) {
                        data = this.emailtext.replace(/^From.+\r?\n/, '');
                        data = exporter.win.findnow_utils.IETescapeBeginningFrom(data);

                        const clone = file.clone();

                        // The name is taken from the subject "corrected"
                        clone.append(sub + '.eml');

                        savePath = clone.path;

                        clone.createUnique(0, 0o644);

                        const time = (hdr.dateInSeconds) * 1000;

                        exporter.win.findnow_utils.IETwriteDataOnDisk(clone, data, false, null, time);

                        // myEMLlistener.file2 exists just if we need the index
                        if (myEMLlistner.file2) {
                            const nameNoExt = clone.leafName.replace(/\.eml$/, '');

                            // If the leafName of the file is not equal to "sub", we must change also
                            // the corrispondent section of hdrArray[IETexported], otherwise the link
                            // in the index will be wrong
                            if (sub !== nameNoExt) {
                                parts[4] = nameNoExt;

                                hdrArray[exporter.IETexported] = parts.join('§][§^^§');
                            }
                        }
                    }
                }

                exporter.IETexported = exporter.IETexported + 1;

                if (sub) {
                    exporter.win.findnow_utils.IETwritestatus(
                        'exported ' +
                        exporter.IETexported +
                        ' ' +
                        'messages ' +
                        ' ' +
                        (exporter.IETtotal + exporter.IETskipped));
                }

                if (exporter.IETabort) {
                    exporter.IETabort = false;
                    return;
                }

                let nextUri;
                let nextFile;

                if (exporter.IETexported < exporter.IETtotal) {
                    if (fileArray) {
                        nextUri = uriArray[exporter.IETexported];
                        nextFile = fileArray[exporter.IETexported];
                    } else if (!hdrArray) {
                        nextUri = uriArray[exporter.IETexported];
                        nextFile = file;
                    } else {
                        const parts = hdrArray[exporter.IETexported].split('§][§^^§');

                        nextUri = parts[5];
                        nextFile = file;
                    }

                    exporter.saveMsgAsEML(
                        nextUri,
                        nextFile,
                        append,
                        uriArray,
                        hdrArray,
                        fileArray,
                        imapFolder,
                        false,
                        file2,
                        msgFolder
                    );
                } else {
                    exporter.IETexported = 0;
                    exporter.IETtotal = 0;
                    exporter.IETskipped = 0;

                    if (document.getElementById('IETabortIcon')) {
                        document.getElementById('IETabortIcon').collapsed = true;
                    }
                }
            }
            catch( et ) {
                if (DEBUG) {
                    console.log("call to saveMsgAsEML.onStopRequest68 - error = ");
                    console.log(et);
                }

                if( savePath !== null ) {
                    if (!exporter.win.findnow_utils.FNisFileExist(savePath)) {
                        exporter.win.alert("Die Email konnte nicht abgelegt werden unter: " + savePath);
                    }
                }
                else {
                    exporter.win.alert("Beim Speichern der Email trat ein Fehler auf, bitte kontrollieren sie das Ziel!");
                }
            }

            if (exporter.win.findnow_utils.FNisFileExist(savePath)) {
                if (exporter.win.findnow_utils.FNisMoveToTrash()) {
                    let trashFodler = exporter.win.findnow_utils.FNgetTrashFolderURI(hdr);
                    exporter.win.findnow_utils.FNmoveMessage(msguri, trashFodler.URI);
                }
            }
        },

        // cleidigh - Handle old/new streamlisteners signatures after TB67
        onDataAvailable60: function(aRequest, aContext, aInputStream, aOffset, aCount) {
            this.onDataAvailable68(aRequest, aInputStream, aOffset, aCount);
        },

        onDataAvailable68: function(aRequest, aInputStream, aOffset, aCount) {
            const scriptStream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);

            scriptStream.init(aInputStream);

            this.emailtext += scriptStream.read(scriptStream.available());
        },
    };

    // -----------------------------------------------------------------

    // cleidigh - Handle old/new streamlisteners signatures after TB67
    const versionChecker = Services.vc;
    const currentVersion = Services.appinfo.platformVersion;

    if (versionChecker.compare(currentVersion, "61") >= 0) {
        myEMLlistner.onDataAvailable = myEMLlistner.onDataAvailable68;
        myEMLlistner.onStartRequest = myEMLlistner.onStartRequest68;
        myEMLlistner.onStopRequest = myEMLlistner.onStopRequest68;
    } else {
        myEMLlistner.onDataAvailable = myEMLlistner.onDataAvailable60;
        myEMLlistner.onStartRequest = myEMLlistner.onStartRequest60;
        myEMLlistner.onStopRequest = myEMLlistner.onStopRequest60;
    }

    const mms = this.win.messenger.messageServiceFromURI(msguri)
        .QueryInterface(Ci.nsIMsgMessageService);

    try {
        hdr = mms.messageURIToMsgHdr(msguri);

        if (DEBUG) {
            console.log("call to saveMsgAsEML - subject = " +
                hdr.mime2DecodedSubject +
                " - messageKey = " +
                hdr.messageKey);
        }

        myEMLlistner.file2 = file2;
        myEMLlistner.msgFolder = msgFolder;

        mms.streamMessage(msguri, myEMLlistner, this.win.msgWindow, null, false, null);
    } catch (e) {
        if (DEBUG) {
            console.log("call to saveMsgAsEML - error = " + e);
        } else {
            console.log(e);
        }
    }
}
