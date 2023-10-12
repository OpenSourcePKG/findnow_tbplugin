import {
    Components as C,
    ExtensionMail,
    IExtensionAPI, nsIJSRAIIHelper,
    Services as S,
    ChromeUtils as ChUt,
    PathUtils as ph, nsIMsgDBHdr
} from 'mozilla-webext-types';
import {IFindnow} from './IFindnow';

import {Exporter} from './inc/Exporter/Exporter';
import {SaveToOptions} from './inc/SaveToOptions';
import {SaveToResulte} from './inc/SaveToResulte';
import {SubjectBuilder} from './inc/Subject/SubjectBuilder';
import {SubjectOptions} from './inc/Subject/SubjectOptions';
import {UtilsFile} from './inc/Utils/UtilsFile';

declare const Components: C;
declare const Services: S;
declare const ExtensionAPI: any;
declare const ChromeUtils: ChUt;
declare let PathUtils: ph | { join: (...args: string[]) => string;};

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
    public chromeHandle: nsIJSRAIIHelper|null = null;

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

        const aomStartup = Cc['@mozilla.org/addons/addon-manager-startup;1'].getService(Ci.amIAddonManagerStartup);
        const manifestURI = Services.io.newURI('manifest.json', null, this.extension.rootURI);

        this.chromeHandle = aomStartup.registerChrome(
            manifestURI,
            [
                [
                    'content',
                    'findnow',
                    'chrome/content/'
                ]
            ]
        );
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
                 * Return the raw subject from message ID.
                 * @param {number} messageId
                 * @returns {string}
                 */
                getRawSubject: async(messageId: number): Promise<string> => {
                    console.log(`Findnow::implementation::getRawSubject: messageid: ${messageId}`);

                    const msgHdr = this.getMsgHdr(messageId);

                    return msgHdr ? SubjectBuilder.getRawSubject(msgHdr) : '';
                },

                /**
                 * Return a filename for eml.
                 * @param {number} messageId
                 * @param {SubjectOptions} options
                 * @returns {string}
                 */
                buildFilename: async(messageId: number, options: SubjectOptions): Promise<string> => {
                    console.log(`Findnow::implementation::buildSubject: messageid: ${messageId}`);

                    const msgHdr = this.getMsgHdr(messageId);

                    if (msgHdr) {
                        return SubjectBuilder.buildFilename(msgHdr, options);
                    }

                    return '';
                },

                /**
                 * Save a message to file.
                 * @param {number} messageId - ID of a message
                 * @param {SaveToOptions} options
                 * @returns {SaveToResulte}
                 */
                saveTo: async(messageId: number, options: SaveToOptions): Promise<SaveToResulte> => {
                    console.log(`Findnow::implementation::saveTo: messageid: ${messageId}`);

                    const exporter = new Exporter();
                    const msgUri = this.getMessageUriById(messageId);

                    if (msgUri) {
                        const saveResulte = await exporter.saveTo(msgUri, options);

                        if (saveResulte) {
                            return {
                                success: true
                            };
                        }
                    }

                    return {
                        success: false,
                        error: 'Message not found!'
                    };
                },

                /**
                 * Pick the path by dialog.
                 * @param {string} defaultPath - The path is ignored when the string is empty.
                 * @param {string} dlgTitle - Title for dialog.
                 * @returns {string|null} Selected path from dialog.
                 */
                pickPath: async(defaultPath: string, dlgTitle: string): Promise<string|null> => {
                    console.log('pickPath');

                    const fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

                    const recentWindow = Services.wm.getMostRecentWindow('');

                    fp.init(recentWindow, dlgTitle, Ci.nsIFilePicker.modeGetFolder);
                    // fp.okButtonLabel = '';

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

                    return null;
                },

                /**
                 * Joint two paths to a string
                 * @param {string} path
                 * @param {string} subdir
                 * @returns {string}
                 */
                joinPath: async(path: string, subdir: string): Promise<string> => {
                    return PathUtils.join(path, subdir);
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
                }
            } as IFindnow
        };
    }

}