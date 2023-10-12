import {Translation} from '../inc/Utils/Translation';
import {Settings} from '../inc/Settings';
import {FindnowBrowser} from '../../api/findnow/FindnowBrowser';

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

        const options = await new Settings().get();

        // inputs & etc ... --------------------------------------------------------------------------------------------

        const inputAddtimeCheckbox = Options.getElm('addtimeCheckbox');
        const inputExportEmlDir = Options.getElm('export_eml_dir');
        const inputUseExportEmlDir = Options.getElm('use_export_eml_dir');
        const inputEmlDirButton = Options.getElm('eml_dir_button');
        const inputExportEmlSubDir = Options.getElm('export_eml_sub_dir');
        const inputUseExportEmlSubDir = Options.getElm('use_export_eml_sub_dir');
        const inputUseFilenameAbbreviation = Options.getElm('use_filename_abbreviation');
        const inputFilenameAbbreviation = Options.getElm('filename_abbreviation');
        const inputAllowEditSubject = Options.getElm('allow_edit_subject');
        const inputMoveToTrash = Options.getElm('move_to_trash');

        // row usw export default dir ----------------------------------------------------------------------------------

        if (options.export_eml_use_dir) {
            inputUseExportEmlDir.setAttribute('checked', 'true');
            inputExportEmlDir.removeAttribute('disabled');
            inputEmlDirButton.removeAttribute('disabled');
        } else {
            inputExportEmlDir.setAttribute('disabled', 'true');
            inputEmlDirButton.setAttribute('disabled', 'true');
            inputUseExportEmlDir.removeAttribute('checked');
        }

        inputExportEmlDir.setAttribute('value', options.export_eml_dir);

        inputUseExportEmlDir.onclick = (): void => {
            const isChecked = inputUseExportEmlDir.checked;

            if (isChecked) {
                inputUseExportEmlDir.setAttribute('checked', 'true');
                inputExportEmlDir.removeAttribute('disabled');
                inputEmlDirButton.removeAttribute('disabled');
            } else {
                inputExportEmlDir.setAttribute('disabled', 'true');
                inputEmlDirButton.setAttribute('disabled', 'true');
                inputUseExportEmlDir.removeAttribute('checked');
            }
        };

        inputEmlDirButton.onclick = async(): Promise<void> => {
            const path = await browser.findnow.pickPath(
                inputExportEmlDir.value,
                browser.i18n.getMessage('dialog.pickup.title')
            );

            if (path) {
                inputExportEmlDir.setAttribute('value', path);
            }
        };

        // row use sub dir ---------------------------------------------------------------------------------------------

        inputUseExportEmlSubDir.checked = options.export_eml_use_sub_dir;

        if (options.export_eml_use_sub_dir) {
            inputUseExportEmlSubDir.setAttribute('checked', 'true');
            inputExportEmlSubDir.removeAttribute('disabled');
        } else {
            inputExportEmlSubDir.setAttribute('disabled', 'true');
            inputUseExportEmlSubDir.removeAttribute('checked');
        }

        inputExportEmlSubDir.setAttribute('value', options.export_eml_sub_dir);

        inputUseExportEmlSubDir.onclick = (): void => {
            const isChecked = inputUseExportEmlSubDir.checked;

            if (isChecked) {
                inputExportEmlSubDir.removeAttribute('disabled');
            } else {
                inputExportEmlSubDir.setAttribute('disabled', 'true');
            }
        };

        // row add time to filename ------------------------------------------------------------------------------------

        if (options.export_filenames_addtime) {
            inputAddtimeCheckbox.setAttribute('checked', 'true');
        }

        // row filename abbreviation -----------------------------------------------------------------------------------

        if (options.use_filename_abbreviation) {
            inputUseFilenameAbbreviation.setAttribute('checked', 'true');
            inputFilenameAbbreviation.removeAttribute('disabled');
        } else {
            inputUseFilenameAbbreviation.removeAttribute('checked');
            inputFilenameAbbreviation.setAttribute('disabled', 'true');
        }

        inputFilenameAbbreviation.setAttribute('value', options.filename_abbreviation);

        inputUseFilenameAbbreviation.onclick = (): void => {
            const isChecked = inputUseFilenameAbbreviation.checked;

            if (isChecked) {
                inputFilenameAbbreviation.removeAttribute('disabled');
            } else {
                inputFilenameAbbreviation.setAttribute('disabled', 'true');
            }
        };

        // row allow edit subject --------------------------------------------------------------------------------------

        if (options.allow_edit_subject) {
            inputAllowEditSubject.setAttribute('checked', 'true');
        }

        // row move to trash -------------------------------------------------------------------------------------------

        if (options.move_to_trash) {
            inputMoveToTrash.setAttribute('checked', 'true');
        }

        // save --------------------------------------------------------------------------------------------------------

        const btnSave = document.getElementById('commonsave');

        if (btnSave) {
            btnSave.onclick = async(): Promise<void> => {

                options.export_filenames_addtime = inputAddtimeCheckbox.checked;
                options.export_eml_dir = inputExportEmlDir.value;
                options.export_eml_use_dir = inputUseExportEmlDir.checked;
                options.export_eml_sub_dir = inputExportEmlSubDir.value;
                options.export_eml_use_sub_dir = inputUseExportEmlSubDir.checked;
                options.use_filename_abbreviation = inputUseFilenameAbbreviation.checked;
                options.filename_abbreviation = inputFilenameAbbreviation.value;
                options.allow_edit_subject = inputAllowEditSubject.checked;
                options.move_to_trash = inputMoveToTrash.checked;

                await new Settings().set(options);
            };
        }

        Translation.lang();
    }

}

/**
 * Main registiert function.
 */
(async(): Promise<void> => {
    console.log('Findnow::Options: addEventListener');
    window.addEventListener('load', Options.onLoad, false);
})();