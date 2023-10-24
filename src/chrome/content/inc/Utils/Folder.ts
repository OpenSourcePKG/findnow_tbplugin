import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {FindnowOptions} from '../Types/FindnowOptions';
import {Path} from './Path';

declare const browser: FindnowBrowser;

/**
 * Helper folder object. Help to build the path for eml saving.
 */
export class Folder {

    /**
     * Return the main directory by settings.
     * @param settings
     */
    public static async getPredefinedFolder(settings: FindnowOptions): Promise<string> {
        if (!settings.export_eml_use_dir) {
            return '';
        }

        return settings.export_eml_dir;
    }

    /**
     * Return the directory for eml saving by settings, can call pickup dialog.
     * @param {FindnowOptions} settings
     */
    public static async getSaveFolder(settings: FindnowOptions): Promise<string> {
        let folder = await Folder.getPredefinedFolder(settings);

        const pickFile = await browser.findnow.showDirectoryPicker(
            folder ? folder : '',
            browser.i18n.getMessage('dialogPickSaveFolderTitle'),
            browser.i18n.getMessage('dialogPickSaveFolderButtonOK')
        );

        if (pickFile) {
            folder = pickFile;
        } else {
            return '';
        }

        // exist sub dir -----------------------------------------------------------------------------------------------

        try {
            if (folder && settings.export_eml_use_sub_dir) {
                const subdir = settings.export_eml_sub_dir;

                if (subdir === '') {
                    console.log('Folder::getSaveFolder: subdir string is empty!');
                } else {
                    const tSubdir = await Path.join(folder, subdir);

                    if (await browser.findnow.existPath(tSubdir)) {
                        folder = tSubdir;
                    }
                }
            }
        } catch (e) {
            console.log(e);
            return '';
        }

        return folder;
    }

}