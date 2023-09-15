import {FindnowBrowser} from '../../api/findnow/api';
import {FindnowOptions} from '../types/FindnowOptions';

declare const browser: FindnowBrowser;

/**
 * Options UI Object.
 */
export class Options {

    /**
     * Return an HTMLInputElement in short call.
     * @param {string} name - Name of HTMLInputElement
     * @returns {HTMLInputElement}
     * @throws {Error}
     */
    public static getElm(name: string): HTMLInputElement {
        const elm = document.getElementById(name);

        if (elm) {
            return elm as HTMLInputElement;
        }

        throw Error(`FindNow::Options: Element not found by name: ${name}`);
    }

    /**
     * Call by window laod event.
     */
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

        // inputs & etc ... --------------------------------------------------------------------------------------------

        const inputDefaultButton = Options.getElm('defaultButton');
        const inputAddtimeCheckbox = Options.getElm('addtimeCheckbox');
        const inputExportEmlDir = Options.getElm('export_eml_dir');
        const inputUseExportEmlDir = Options.getElm('use_export_eml_dir');
        const inputEmlDirButton = Options.getElm('eml_dir_button');
        const inputExportEmlSubDir = Options.getElm('export_eml_sub_dir');
        const inputUseExportEmlSubDir = Options.getElm('use_export_eml_sub_dir');

        // fill and show -----------------------------------------------------------------------------------------------

        if (options.button_show_default) {
            inputDefaultButton.setAttribute('checked', 'true');
        }

        if (options.export_filenames_addtime) {
            inputAddtimeCheckbox.setAttribute('checked', 'true');
        }

        inputExportEmlDir.setAttribute('value', options.export_eml_dir);

        if (options.export_eml_use_dir) {
            inputUseExportEmlDir.setAttribute('checked', 'true');
            inputExportEmlDir.removeAttribute('disabled');
            inputEmlDirButton.removeAttribute('disabled');
        } else {
            inputExportEmlDir.setAttribute('disabled', 'true');
            inputEmlDirButton.setAttribute('disabled', 'true');
            inputUseExportEmlDir.removeAttribute('checked');
        }

        inputExportEmlSubDir.setAttribute('value', options.export_eml_sub_dir);

        inputUseExportEmlSubDir.checked = options.export_eml_use_sub_dir;

        if (options.export_eml_use_sub_dir) {
            inputUseExportEmlSubDir.setAttribute('checked', 'true');
            inputExportEmlSubDir.removeAttribute('disabled');
        } else {
            inputExportEmlSubDir.setAttribute('disabled', 'true');
            inputUseExportEmlSubDir.removeAttribute('checked');
        }

        // save --------------------------------------------------------------------------------------------------------

        const btnSave = document.getElementById('commonsave');

        if (btnSave) {
            btnSave.onclick = async(): Promise<void> => {

                options.button_show_default = inputDefaultButton.checked;
                options.export_filenames_addtime = inputAddtimeCheckbox.checked;
                options.export_eml_dir = inputExportEmlDir.value;
                options.export_eml_use_dir = inputUseExportEmlDir.checked;
                options.export_eml_sub_dir = inputExportEmlSubDir.value;
                options.export_eml_use_sub_dir = inputUseExportEmlSubDir.checked;

                await browser.storage.local.set({
                    findnow: options
                });
            };
        }
    }

}

/**
 * Main registiert function.
 */
(async(): Promise<void> => {
    console.log('Findnow::Options: addEventListener');
    window.addEventListener('load', Options.onLoad, false);
})();