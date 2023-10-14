import {ManifestJson} from 'mozilla-webext-types';

/**
 * We extend the mainifest.json and passing own setting.
 */
export declare interface FindnowMainfest extends ManifestJson {

    /**
     * If this property is present, a warning will be displayed for the plugin (Plugin Management).
     * Use it only for development, with great power comes great responsibility!
     */
    findnow?: {
        debug?: boolean;
    };
}