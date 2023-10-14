import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {FindnowMainfest} from '../FindnowMainfest';

declare const browser: FindnowBrowser;

/**
 * Debug Util
 */
export class Debug {

    public static _DEBUG: boolean|null = null;

    /**
     * Is debugging enable for FindNow.
     * @returns {boolean}
     */
    public static is(): boolean {
        if (Debug._DEBUG === null) {
            const manifest = browser.runtime.getManifest<FindnowMainfest>();

            if (manifest.findnow) {
                if (manifest.findnow.debug) {
                    Debug._DEBUG = manifest.findnow.debug;
                }
            }

            Debug._DEBUG = false;
        }

        return Debug._DEBUG;
    }

}