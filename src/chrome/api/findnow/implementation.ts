import {
    BrowsingContext,
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

    /**
     * getMsgHdr
     * @param {number} messageId
     * @return {nsIMsgDBHdr|null}
     */
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

                    try {
                        const fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

                        const recentWindow = Services.wm.getMostRecentWindow('');

                        if (!recentWindow) {
                            console.error('showDirectoryPicker: No window available');
                            return null;
                        }

                        if (recentWindow.closed) {
                            console.error('showDirectoryPicker: Window is closed');
                            return null;
                        }

                        let browsingContext = recentWindow.browsingContext;

                        if (!browsingContext) {
                            console.warn('showDirectoryPicker: Primary window context not available, trying fallback');

                            const allWindows = Services.wm.getEnumerator('');

                            let fallbackWindow: any|null = null;

                            while (allWindows.hasMoreElements()) {
                                const win = allWindows.getNext();

                                if (win && !win.closed && win.browsingContext) {
                                    fallbackWindow = win;
                                    break;
                                }
                            }

                            if (fallbackWindow && fallbackWindow.browsingContext) {
                                browsingContext = fallbackWindow.browsingContext as BrowsingContext;
                                console.log('showDirectoryPicker: Using fallback window');
                            } else {
                                console.error('showDirectoryPicker: No valid window context available');
                                return null;
                            }
                        }

                        fp.init(browsingContext, dlgTitle, Ci.nsIFilePicker.modeGetFolder);

                        if (btnTitle !== '') {
                            fp.okButtonLabel = btnTitle;
                        }

                        if (defaultPath !== '') {
                            try {
                                const localFile = Components.classes['@mozilla.org/file/local;1']
                                .createInstance(Components.interfaces.nsIFile);

                                localFile.initWithPath(defaultPath);

                                if (localFile.exists() && localFile.isDirectory()) {
                                    fp.displayDirectory = localFile;
                                }
                            } catch (pathError) {
                                console.error('showDirectoryPicker: Error setting default path:', pathError);
                            }
                        }

                        const res = await new Promise((resolve) => {
                            fp.open(resolve);
                        });

                        if (res === Ci.nsIFilePicker.returnOK) {
                            return fp.file.path;
                        } else if (res === Ci.nsIFilePicker.returnCancel) {
                            console.log('showDirectoryPicker: User cancelled dialog');
                            return null;
                        }
                    } catch (error) {
                        console.error('showDirectoryPicker: Fatal error:', error);
                    }

                    return null;
                },

                /**
                 * Exist a path.
                 * @param {string} path
                 * @returns {boolean}
                 */
                existPath: async(path: string): Promise<boolean> => {
                    if (!path || path.trim() === '') {
                        console.warn('existPath: Invalid path parameter provided');
                        return false;
                    }

                    try {
                        const localFile = UtilsFile.fileStrToNsIFile(path, true);

                        if (localFile) {
                            return true;
                        }

                        console.debug(`existPath: Path does not exist: ${path}`);
                    } catch (ex) {
                        const error = ex instanceof Error ? ex : new Error(String(ex));

                        if (error.name === 'NS_ERROR_FILE_UNRECOGNIZED_PATH') {
                            console.warn(`existPath: Invalid path format: ${path}`, ex);
                        } else if (error.name === 'NS_ERROR_FILE_ACCESS_DENIED') {
                            console.error(`existPath: Access denied for path: ${path}`, ex);
                        } else if (error.name === 'NS_ERROR_FILE_NOT_FOUND') {
                            console.debug(`existPath: Path not found: ${path}`);
                        } else {
                            console.error(`existPath: Unexpected error checking path: ${path}`, ex);
                        }

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