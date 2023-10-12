import {FindnowBrowser} from '../../api/findnow/FindnowBrowser';
import {FindnowOptions} from './Types/FindnowOptions';

declare const browser: FindnowBrowser;

/**
 * The settings object for FindNow.
 */
export class Settings {

    /**
     * The default options for FindNow.
     * @protected {FindnowOptions}
     */
    protected _getDefaults(): FindnowOptions {
        return {
            export_overwrite: true,
            export_set_filetime: false,
            log_enable: false,
            export_filename_charset: '',

            export_eml_use_dir: false,
            export_eml_dir: '',
            use_filename_abbreviation: false,
            filename_abbreviation: '',
            allow_edit_subject: false,
            move_to_trash: false,
            export_filenames_addtime: true,
            export_eml_use_sub_dir: false,
            export_eml_sub_dir: '',

            export_save_auto_eml: false
        };
    }

    /**
     * Return the options for FindNow settings.
     * @returns {FindnowOptions}
     */
    public async get(): Promise<FindnowOptions> {
        let options: FindnowOptions = this._getDefaults();

        try {
            const storeData = await browser.storage.local.get();

            if (storeData) {
                if (storeData.findnow) {
                    options = storeData.findnow as FindnowOptions;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return options;
    }

    /**
     * Set the options for FindNow.
     * @param {FindnowOptions} options
     * @returns {any}
     */
    public async set(options: FindnowOptions): Promise<any> {
        return browser.storage.local.set({
            findnow: options
        });
    }

}