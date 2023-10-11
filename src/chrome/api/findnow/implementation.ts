import {
    Components as C,
    ExtensionMail,
    IExtensionAPI, nsIJSRAIIHelper,
    Services as S,
    ChromeUtils as ChUt,
    PathUtils as ph, nsIMsgDBHdr
} from 'mozilla-webext-types';
import {FindnowApi} from './FindnowApi';
import {IFindnow} from './IFindnow';

import {Exporter} from './inc/Exporter';
import {SaveToOptions} from './inc/SaveToOptions';
import {SaveToResulte} from './inc/SaveToResulte';
import {Utils} from './inc/Utils';

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
     * Api for Findnow.
     * @member {FindnowApi}
     */
    protected _findnow: FindnowApi;

    /**
     * Construct FindNow implementation.
     * @param {ExtensionMail} ext
     */
    public constructor(ext: ExtensionMail) {
        super(ext);
        this.extension = ext;
        this._findnow = new FindnowApi(this);
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
            findnow: this._findnow
        };
    }

}