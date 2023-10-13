import {Translation} from '../inc/Utils/Translation';
import {Settings} from '../inc/Settings';
import {FindnowBrowser} from '../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

type onChangeOptionEvent = (event: Event) => void;
type onSaveOptionEvent = () => void;

/**
 * Options UI Object.
 */
export class Options {

    /**
     * Return an HTMLInputElement in short call.
     * @param {string} name - Name of HTMLInputElement
     * @param {onChangeOptionEvent} onChange - On change event inline function.
     * @returns {HTMLInputElement}
     * @throws {Error}
     */
    public static getElm(name: string, onChange?: onChangeOptionEvent): HTMLInputElement {
        const elm = document.getElementById(name);

        if (elm) {
            if (onChange) {
                elm.addEventListener('change', (event) => {
                    onChange(event);
                });
            }

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
        let onSave: onSaveOptionEvent|null = null;

        // save onChange event -----------------------------------------------------------------------------------------

        const onChange: onChangeOptionEvent = () => {
            if (onSave) {
                onSave();
            }
        };

        // inputs & etc ... --------------------------------------------------------------------------------------------

        const inputAddtimeCheckbox = Options.getElm('addtimeCheckbox', onChange);
        const inputExportEmlDir = Options.getElm('export_eml_dir', onChange);
        const inputUseExportEmlDir = Options.getElm('use_export_eml_dir', onChange);
        const inputEmlDirButton = Options.getElm('eml_dir_button', onChange);
        const inputExportEmlSubDir = Options.getElm('export_eml_sub_dir', onChange);
        const inputUseExportEmlSubDir = Options.getElm('use_export_eml_sub_dir', onChange);
        const inputUseFilenameAbbreviation = Options.getElm('use_filename_abbreviation', onChange);
        const inputFilenameAbbreviation = Options.getElm('filename_abbreviation', onChange);
        const inputAllowEditSubject = Options.getElm('allow_edit_subject', onChange);
        const inputMoveToTrash = Options.getElm('move_to_trash', onChange);

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
                browser.i18n.getMessage('dialog.pickup.title'),
                browser.i18n.getMessage('dialog.pickup.btn_title')
            );

            if (path) {
                inputExportEmlDir.setAttribute('value', path);
            }

            if (onSave) {
                onSave();
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
        onSave = async(): Promise<void> => {
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