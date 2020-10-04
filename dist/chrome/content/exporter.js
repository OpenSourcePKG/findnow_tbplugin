'use strict';

const {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');

/**
 * load
 * @param win
 */
function load(win) {
    this.win = win;

    console.log('Load Exporter');
}

/**
 * saveTo
 */
function saveTo() {
    console.log('Exporter: SaveTo');

    const selectedMsg = this.win.gFolderDisplay.selectedMessage;
    const msgURI = selectedMsg.folder.getUriForMsg(selectedMsg);

    console.log(msgURI);

    const emlsArray = [];
    emlsArray.push(msgURI);

    const file = this.win.findnow_utils.getMsgDestination();

    this.saveMsgAsEML(msgURI, file, false, emlsArray, null, null, false, false, null, null);
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
            let sub;
            let data;

            this.scriptStream = null;

            if (clipboard) {
                IETcopyStrToClip(this.emailtext);
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

                    data = IETescapeBeginningFrom(data);
                }

                const fileClone = file.clone();

                IETwriteDataOnDisk(fileClone, data, true, null, null);

                sub = true;
            } else {
                if (!hdrArray) {
                    sub = exporter.win.findnow_utils.getSubjectForHdr(hdr, file.path);
                } else {
                    let parts = hdrArray[IETexported].split('§][§^^§');

                    sub = parts[4];
                    sub = sub.replace(/[\x00-\x1F]/g, '_');
                }

                sub = IETstr_converter(sub);

                if (sub) {
                    data = this.emailtext.replace(/^From.+\r?\n/, '');
                    data = IETescapeBeginningFrom(data);

                    const clone = file.clone();

                    // The name is taken from the subject "corrected"
                    clone.append(sub + '.eml');
                    clone.createUnique(0, 0o644);

                    const time = (hdr.dateInSeconds) * 1000;

                    IETwriteDataOnDisk(clone, data, false, null, time);

                    // myEMLlistener.file2 exists just if we need the index
                    if (myEMLlistner.file2) {
                        const nameNoExt = clone.leafName.replace(/\.eml$/, '');

                        // If the leafName of the file is not equal to "sub", we must change also
                        // the corrispondent section of hdrArray[IETexported], otherwise the link
                        // in the index will be wrong
                        if (sub !== nameNoExt) {
                            parts[4] = nameNoExt;

                            hdrArray[IETexported] = parts.join('§][§^^§');
                        }
                    }
                }
            }

            IETexported = IETexported + 1;

            if (sub) {
                IETwritestatus(mboximportbundle.GetStringFromName('exported') +
                    ' ' +
                    IETexported +
                    ' ' +
                    mboximportbundle.GetStringFromName('msgs') +
                    ' ' +
                    (IETtotal + IETskipped));
            }

            if (IETabort) {
                IETabort = false;
                return;
            }

            var nextUri;
            var nextFile;

            if (IETexported < IETtotal) {
                if (fileArray) {
                    nextUri = uriArray[IETexported];
                    nextFile = fileArray[IETexported];
                } else if (!hdrArray) {
                    nextUri = uriArray[IETexported];
                    nextFile = file;
                } else {
                    parts = hdrArray[IETexported].split('§][§^^§');

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
                if (myEMLlistner.file2) {
                    createIndex(0, myEMLlistner.file2, hdrArray, myEMLlistner.msgFolder, false, true);
                }

                IETexported = 0;
                IETtotal = 0;
                IETskipped = 0;

                if (IETglobalMsgFolders) {
                    IETglobalMsgFoldersExported = IETglobalMsgFoldersExported + 1;

                    if (IETglobalMsgFoldersExported && IETglobalMsgFoldersExported < IETglobalMsgFolders.length) {
                        if (imapFolder) {
                            setTimeout(function() {
                                exportIMAPfolder(IETglobalMsgFolders[IETglobalMsgFoldersExported], file.parent);
                            }, 1000);
                        } else {
                            exportAllMsgsStart(0, IETglobalFile, IETglobalMsgFolders[IETglobalMsgFoldersExported]);
                        }
                    } else if (document.getElementById('IETabortIcon')) {
                        document.getElementById('IETabortIcon').collapsed = true;
                    }
                } else if (document.getElementById('IETabortIcon')) {
                    document.getElementById('IETabortIcon').collapsed = true;
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

    const hdr = mms.messageURIToMsgHdr(msguri);

    try {
        console.log("call to saveMsgAsEML - subject = " + hdr.mime2DecodedSubject + " - messageKey = " + hdr.messageKey);
    } catch (e) {
        console.log("call to saveMsgAsEML - error = " + e);
    }

    myEMLlistner.file2 = file2;
    myEMLlistner.msgFolder = msgFolder;

    mms.streamMessage(msguri, myEMLlistner, this.win.msgWindow, null, false, null);
}