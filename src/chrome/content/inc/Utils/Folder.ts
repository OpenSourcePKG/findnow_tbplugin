import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
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