import {FindnowBrowser} from '../../api/findnow/api';
import {Consts} from '../inc/Consts';
import {SendMessageEditSubject} from '../inc/SendMessageEditSubject';
import {Settings} from '../inc/Settings';
import {Translation} from '../inc/Utils/Translation';

declare const browser: FindnowBrowser;

export class Editsubject {

    public static setSubjectText(text: string): void {
        const subText = window.document.getElementById('subject_text') as HTMLInputElement|null;

        if (subText) {
            subText.value = text;
        }
    }

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
        const btnCancle = document.getElementById('editsubject_cancle') as HTMLButtonElement|null;

        if (btnCancle) {
            btnCancle.onclick = (): void => {
                window.close();
            };
        }

        if (btnSave) {
            btnSave.onclick = (): void => {
                console.log('test');
            };
        }

        Translation.lang();

        // send the window manager, we are ready for incoming data
        browser.runtime.sendMessage({status: 'loaded'}).then();
    }

    public static async save(): Promise<void> {
        if ((window as any).arguments) {
            const retVals = (window as any).arguments[0];

            const subText = window.document.getElementById('subject_text') as HTMLInputElement|null;
            const mTt = document.getElementById('move_to_trash') as HTMLInputElement|null;

            retVals.returnsubject = subText ? subText.value : '';
            retVals.moveToTrash = mTt ? mTt.checked : false;
            retVals.resulte = true;
        }

        window.close();
    }

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

    if (sender.id && (sender.id === Consts.ID)) {
        const esMsg = message as SendMessageEditSubject;

        Editsubject.setSubjectText(esMsg.header.subject);
    }
});