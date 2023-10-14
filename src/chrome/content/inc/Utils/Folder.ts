import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {FindnowOptions} from '../Types/FindnowOptions';

declare const browser: FindnowBrowser;

/**
 * Helper folder object. Help to build the path for eml saving.
 */
export class Folder {

    /**
     * Return the main directory by settings.
     * @param settings
     */
    public static async getPredefinedFolder(settings: FindnowOptions): Promise<string|null> {
        if (!settings.export_eml_use_dir) {
            return null;
        }

        return settings.export_eml_dir;
    }

    /**
     * Return the directory for eml saving by settings, can call pickup dialog.
     * @param {FindnowOptions} settings
     */
    public static async getSaveFolder(settings: FindnowOptions): Promise<string|null> {
        let file = await Folder.getPredefinedFolder(settings);
        let showPicker = false;

        if (file) {
            showPicker = true;
        }

        if (!showPicker && !settings.export_save_auto_eml) {
            showPicker = true;
        }

        if (showPicker) {
            const pickFile = await browser.findnow.pickPath(
                file ? file : '',
                browser.i18n.getMessage('dialogPickSaveFolderTitle'),
                browser.i18n.getMessage('dialogPickSaveFolderButtonOK')
            );

            if (pickFile) {
                file = pickFile;
            } else {
                return null;
            }
        }

        // create sub dir ----------------------------------------------------------------------------------------------

        try {
            if (file && settings.export_eml_use_sub_dir) {
                const subdir = settings.export_eml_sub_dir;

                if (subdir === '') {
                    console.log('Folder::getSaveFolder: subdir string is empty!');
                } else {
                    const tSubdir = await browser.findnow.joinPath(file, subdir);

                    if (await browser.findnow.existPath(tSubdir)) {
                        file = tSubdir;
                    }
                }
            }
        } catch (e) {
            console.log(e);
            return null;
        }

        return file;
    }

}