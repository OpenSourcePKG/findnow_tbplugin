import {
    Components as C,
    ExtensionMail,
    IExtensionAPI, nsIJSRAIIHelper, Services as S
} from 'mozilla-webext-types';

import {Exporter} from './inc/Exporter';

declare const Components: C;
declare const Services: S;
declare const ExtensionAPI: any;

const {
    classes: Cc,
    interfaces: Ci
} = Components;

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

    /**
     * Return a URI by Message ID.
     * @param {number} messageId - ID a message.
     * @returns {string}
     */
    private _getMessageUriById(messageId: number): string | null {
        const msgHdr = this.extension.messageManager.get(messageId);

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
                saveTo: async(messageId: number): Promise<boolean> => {
                    const exporter = new Exporter();
                    const msgUri = this._getMessageUriById(messageId);

                    if (msgUri) {
                        await exporter.saveTo(msgUri);
                        return true;
                    }

                    return false;
                }
            }
        };
    }

}