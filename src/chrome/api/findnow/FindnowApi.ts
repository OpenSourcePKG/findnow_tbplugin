import {
    ChromeUtils as ChUt,
    Components as C,
    PathUtils as ph,
    Services as S
} from '../../../../../mozilla-webext-types';
import {IFindnow} from './IFindnow';
import implementation from './implementation';
import {Exporter} from './inc/Exporter';
import {SaveToOptions} from './inc/SaveToOptions';
import {SaveToResulte} from './inc/SaveToResulte';
import {Utils} from './inc/Utils';

declare const Components: C;
declare const Services: S;
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
 * FindNow API Object.
 */
export class FindnowApi implements IFindnow {

    /**
     * Implemtation ExtensionAPI.
     * @member {implementation}
     */
    protected _imp: implementation;

    /**
     * Constructor for Findnow API.
     * @param {implementation} imp
     */
    public constructor(imp: implementation) {
        this._imp = imp;
    }

    /**
     * Return the raw subject from message ID.
     * @param {number} messageId
     * @returns {string}
     */
    public async getRawSubject(messageId: number): Promise<string> {
        const msgHdr = this._imp.getMsgHdr(messageId);
        let subj = '';

        if (msgHdr) {
            if (msgHdr.mime2DecodedSubject) {
                subj = msgHdr.mime2DecodedSubject;

                // eslint-disable-next-line no-bitwise
                if (msgHdr.flags & Ci.nsMsgMessageFlags.HasRe) {
                    subj = `Re_${subj}`;
                }
            }
        }

        return subj;
    }

    /**
     * Save a message to file.
     * @param {number} messageId - ID of a message
     * @param {SaveToOptions} options
     * @returns {SaveToResulte}
     */
    public async saveTo(messageId: number, options: SaveToOptions): Promise<SaveToResulte> {
        console.log(`Findnow::implementation::saveTo: messageid: ${messageId}`);

        const exporter = new Exporter();
        const msgUri = this._imp.getMessageUriById(messageId);

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
    }

    /**
     * Pick the path by dialog.
     * @param {string} defaultPath - The path is ignored when the string is empty.
     * @returns {string|null} Selected path from dialog.
     */
    public async pickPath(defaultPath: string): Promise<string|null> {
        console.log('pickPath');

        const fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

        const recentWindow = Services.wm.getMostRecentWindow('');

        fp.init(recentWindow, '', Ci.nsIFilePicker.modeGetFolder);

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
    }

    /**
     * Joint two paths to a string
     * @param {string} path
     * @param {string} subdir
     * @returns {string}
     */
    public async joinPath(path: string, subdir: string): Promise<string> {
        return PathUtils.join(path, subdir);
    }

    /**
     * Exist a path.
     * @param {string} path
     * @returns {boolean}
     */
    public async existPath(path: string): Promise<boolean> {
        try {
            const localFile = Utils.fileStrToNsIFile(path, true);

            if (localFile) {
                return true;
            }
        } catch (ex) {
            console.log(ex);
        }

        return false;
    }

}