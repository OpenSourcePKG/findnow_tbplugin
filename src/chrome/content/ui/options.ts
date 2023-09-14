import {FindnowBrowser} from '../../api/findnow/api';
import {FindnowOptions} from '../types/FindnowOptions';

declare const browser: FindnowBrowser;

export class Options {

    public static async onLoad(): Promise<void> {
        console.log('Findnow::Options: onLoad');

        /**
         * Set default options.
         */
        let options: FindnowOptions = {
            export_overwrite: true,
            export_set_filetime: false,
            log_enable: false,
            export_filename_charset: '',

            button_show_default: false,
            export_eml_use_dir: false,
            export_eml_dir: '',
            use_filename_abbreviation: false,
            filename_abbreviation: '',
            allow_edit_subject: false,
            move_to_trash: false,
            export_filenames_addtime: true,
            export_eml_use_sub_dir: false,
            export_eml_sub_dir: ''
        };

        const storeData = await browser.storage.local.get();

        if (storeData) {
            if (storeData.findnow) {
                options = storeData.findnow as FindnowOptions;
            }
        }

        (document.getElementById('defaultButton')! as HTMLInputElement).checked = options.button_show_default;
        (document.getElementById('addtimeCheckbox')! as HTMLInputElement).checked = options.export_filenames_addtime;
        (document.getElementById('export_eml_dir')! as HTMLInputElement).value = options.export_eml_dir;

        (document.getElementById('use_export_eml_dir')! as HTMLInputElement).checked = options.export_eml_use_dir;

        if (options.export_eml_use_dir) {
            (document.getElementById('export_eml_dir')! as HTMLInputElement).removeAttribute('disabled');
            (document.getElementById('eml_dir_button')! as HTMLInputElement).removeAttribute('disabled');
        } else {
            (document.getElementById('export_eml_dir')! as HTMLInputElement).setAttribute('disabled', 'true');
            (document.getElementById('eml_dir_button')! as HTMLInputElement).setAttribute('disabled', 'true');
        }

        (document.getElementById('export_eml_sub_dir')! as HTMLInputElement).value = options.export_eml_sub_dir;

        (document.getElementById('use_export_eml_sub_dir')! as HTMLInputElement).checked = options.export_eml_use_sub_dir;

        if (options.export_eml_use_sub_dir) {
            (document.getElementById('export_eml_sub_dir')! as HTMLInputElement).removeAttribute('disabled');
        } else {
            (document.getElementById('export_eml_sub_dir')! as HTMLInputElement).setAttribute('disabled', 'true');
        }

        const btnSave = document.getElementById('commonsave');

        if (btnSave) {
            btnSave.onclick = async(): Promise<void> => {

                await browser.storage.local.set({
                    findnow: options
                });
            };
        }
    }

}

(async(): Promise<void> => {
    console.log('Findnow::Options: addEventListener');
    window.addEventListener('load', Options.onLoad, false);
})();