import {FindnowBrowser} from '../../api/findnow/FindnowBrowser';
import {SubjectBuilderFormat} from '../../api/findnow/inc/Subject/SubjectBuilderFormat';
import {Exporter} from '../inc/Exporter/Exporter';
import {SendMessageEditSubject} from '../inc/SendMessageEditSubject';
import {Settings} from '../inc/Settings';
import {Folder} from '../inc/Utils/Folder';
import {Subject} from '../inc/Utils/Subject';
import {Translation} from '../inc/Utils/Translation';

declare const browser: FindnowBrowser;

/**
 * Edit subject dialog.
 */
export class Editsubject {

    /**
     * Data from the background.
     * @member {SendMessageEditSubject|null}
     */
    protected static _data: SendMessageEditSubject|null;

    /**
     * Set the Message data from the Background. Fill the formular by data.
     * @param {SendMessageEditSubject} data
     */
    public static async setMsgData(data: SendMessageEditSubject): Promise<void> {
        Editsubject._data = data;

        const subText = window.document.getElementById('subject_text') as HTMLInputElement | null;

        if (subText) {
            subText.value = await Subject.getSubject(data.header.id);
        }
    }

    /**
     * On load by the browser, load setting and to the formular.
     */
    public static async onLoad(): Promise<void> {
        console.log('Findnow::Editsubject: onLoad');

        const settings = await new Settings().get();

        if (settings) {
            const mTt = document.getElementById('move_to_trash') as HTMLInputElement|null;

            if (mTt) {
                if (settings.move_to_trash) {
                    mTt.setAttribute('checked', 'true');
                }
            }
        }

        const btnSave = document.getElementById('editsubject_save') as HTMLButtonElement|null;
        const btnCancel = document.getElementById('editsubject_cancel') as HTMLButtonElement|null;

        if (btnCancel) {
            btnCancel.onclick = (): void => {
                window.close();
            };
        }

        if (btnSave) {
            btnSave.onclick = async(): Promise<void> => {
                await Editsubject.save();
            };
        }

        Translation.lang();

        // send the window manager, we are ready for incoming data
        browser.runtime.sendMessage({status: 'loaded'}).then();
    }

    /**
     * Save all data from formular in the memory and start the eml saving.
     */
    public static async save(): Promise<void> {
        console.log('Findnow::Editsubject: save');

        const mTt = document.getElementById('move_to_trash') as HTMLInputElement|null;
        const subText = window.document.getElementById('subject_text') as HTMLInputElement|null;

        if (Editsubject._data) {
            const fileDest = await Folder.getSaveFolder(Editsubject._data.settings);

            if (fileDest) {
                const filename = await browser.findnow.buildFilename(Editsubject._data.header.id, {
                    subject: subText ? subText.value : '',
                    dirPath: fileDest,
                    filenames_toascii: true,
                    cutFilename: true,
                    use_abbreviation: Editsubject._data.settings.use_filename_abbreviation,
                    abbreviation: Editsubject._data.settings.filename_abbreviation,
                    add_time_to_name: Editsubject._data.settings.export_filenames_addtime,
                    cutSubject: true,
                    filenameFormat: SubjectBuilderFormat.SIMPLE,
                    use_iso_date: true,
                    pattern: ''
                });

                await Exporter.saveTo(Editsubject._data.header.id, {
                    savefile: filename,
                    editsubject_move_to_trash: mTt ? mTt.checked : false
                });
            } else {
                console.log('Destination can not use for email save!');
            }

            window.close();
        }
    }

    /**
     * Cancel the dialog (close).
     */
    public static async cancel(): Promise<void> {
        if ((window as any).arguments) {
            const retVals = (window as any).arguments[0];

            retVals.resulte = false;
        }

        window.close();
    }

}

/**
 * Add async on load event.
 */
(async(): Promise<void> => {
    console.log('Findnow::Editsubject: addEventListener');
    window.addEventListener('load', Editsubject.onLoad, false);
})();

/**
 * Add runtime onMessage event. Wait from the background of the mail message header.
 */
browser.runtime.onMessage.addListener((message, sender) => {
    console.log('Findnow::Editsubject: runtime.onMessage');
    console.log(message);
    console.log(sender);

    const manifest = browser.runtime.getManifest();

    if (sender.id && (sender.id === manifest.browser_specific_settings.gecko!.id)) {
        const esMsg = message as SendMessageEditSubject;

        Editsubject.setMsgData(esMsg).then();
    } else {
        console.error(`Findnow::Editsubject: unknown sender id '${sender.id}' !== '${manifest.browser_specific_settings.gecko!.id}'`);
    }
});