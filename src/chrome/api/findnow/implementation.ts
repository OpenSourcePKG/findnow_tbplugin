import {
    ChromeUtils as ChUt,
    Components as C,
    ExtensionMail,
    IExtensionAPI,
    nsIMsgDBHdr,
    PathUtils as ph,
    Services as S
} from 'mozilla-webext-types';
import {IFindnow} from './IFindnow';
import {SaveToOptions} from './inc/SaveToOptions';

import {UtilsFile} from './inc/Utils/UtilsFile';
import {UtilsWriter} from './inc/Utils/UtilsWriter';

declare const Components: C;
declare const Services: S;
declare const ExtensionAPI: any;
declare const ChromeUtils: ChUt;
declare let PathUtils: ph | { join: (...args: string[]) => string; };

const {
    classes: Cc,
    interfaces: Ci
} = Components;

if (!PathUtils) {
    const {OS} = ChromeUtils.import('resource://gre/modules/osfile.jsm');

    PathUtils = OS.Path;
}

/**
 * Findnow implementations.
 */
export default class implementation extends ExtensionAPI implements IExtensionAPI<ExtensionMail> {

    /**
     * @member {ExtensionMail}
     */
    public extension: ExtensionMail;

    /**
     * Construct FindNow implementation.
     * @param {ExtensionMail} ext
     */
    public constructor(ext: ExtensionMail) {
        super(ext);

        this.extension = ext;
    }

    /**
     * Start up the implementation.
     */
    public onStartup(): void {
        console.log('Findnow on start up');
    }

    public getMsgHdr(messageId: number): nsIMsgDBHdr | null {
        return this.extension.messageManager.get(messageId);
    }

    /**
     * Return a URI by Message ID.
     * @param {number} messageId - ID a message.
     * @returns {string}
     */
    public getMessageUriById(messageId: number): string | null {
        const msgHdr = this.getMsgHdr(messageId);

        if (msgHdr) {
            return msgHdr.folder.getUriForMsg(msgHdr);
        }

        return null;
    }

    /**
     * Return apis methods
     */
    public getAPI(): Record<string, unknown> {
        return {
            findnow: {

                /**
                 * Pick the path by dialog.
                 * @param {string} defaultPath - The path is ignored when the string is empty.
                 * @param {string} dlgTitle - Title for dialog.
                 * @param {string} btnTitle - Title for button.
                 * @returns {string|null} Selected path from dialog.
                 */
                showDirectoryPicker: async(defaultPath: string, dlgTitle: string, btnTitle: string): Promise<string | null> => {
                    console.log('showDirectoryPicker');

                    const fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

                    const recentWindow = Services.wm.getMostRecentWindow('');

                    if (recentWindow.browsingContext) {
                        fp.init(recentWindow.browsingContext, dlgTitle, Ci.nsIFilePicker.modeGetFolder);

                        if (btnTitle !== '') {
                            fp.okButtonLabel = btnTitle;
                        }

                        if (defaultPath !== '') {
                            const localFile = Components.classes['@mozilla.org/file/local;1']
                            .createInstance(Components.interfaces.nsIFile);

                            localFile.initWithPath(defaultPath);

                            if (localFile.exists()) {
                                fp.displayDirectory = localFile;
                            }
                        }

                        const res = await new Promise((resolve) => {
                            fp.open(resolve);
                        });

                        if (res === Ci.nsIFilePicker.returnOK) {
                            return fp.file.path;
                        }
                    }

                    return null;
                },

                /**
                 * Exist a path.
                 * @param {string} path
                 * @returns {boolean}
                 */
                existPath: async(path: string): Promise<boolean> => {
                    try {
                        const localFile = UtilsFile.fileStrToNsIFile(path, true);

                        if (localFile) {
                            return true;
                        }
                    } catch (ex) {
                        console.log(ex);
                    }

                    return false;
                },

                /**
                 * Save a message to file.
                 * @param {number} messageId - ID of a message
                 * @param {SaveToOptions} options
                 * @returns {boolean}
                 */
                saveTo: async(messageId: number, options: SaveToOptions): Promise<boolean> => {
                    console.log(`Findnow::implementation::saveTo: messageid: ${messageId}`);

                    const msgUri = this.getMessageUriById(messageId);

                    if (msgUri) {
                        const emlFile = UtilsFile.fileStrToNsIFile(options.savefile, false);

                        if (emlFile) {
                            UtilsWriter.writeDataOnDisk(emlFile, options.content, false);

                            return true;
                        }
                    }

                    return false;
                }

            } as IFindnow
        };
    }

}