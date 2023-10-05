import {FindnowBrowser} from '../../../api/findnow/api';
import {FindnowOptions} from '../Types/FindnowOptions';

declare const browser: FindnowBrowser;

export class Folder {

    public static async getPredefinedFolder(settings: FindnowOptions): Promise<string|null> {
        if (!settings.export_eml_use_dir) {
            return null;
        }

        return settings.export_eml_dir;
    }

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
            const pickFile = await browser.findnow.pickPath(file ? file : '');

            if (pickFile) {
                file = pickFile;
            }
        }

        // create sub dir ----------------------------------------------------------------------------------------------

        try {
            if (settings.export_eml_use_sub_dir) {
                const subDir = `${file}/${settings.export_eml_sub_dir}`;

                file = await browser.findnow.createPath(subDir);
            }
        } catch (e) {
            console.log(e);
            return null;
        }

        return file;
    }

}