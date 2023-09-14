import {nsIMsgDBHdr, Services as S} from 'mozilla-webext-types';

declare const Services: S;

export class Utils {

    public static getSubjectForHdr(hdr: nsIMsgDBHdr): string|null {
        // extensions.findnow.move_to_trash
        const moveToTrash = '';
        // extensions.findnow.allow_edit_subject
        const allowEditSubject = true;

        // -------------------------------------------------------------------------------------------------------------

        let subj: string|null = null;

        if (hdr.mime2DecodedSubject) {
            subj = hdr.mime2DecodedSubject;

            // eslint-disable-next-line no-bitwise
            if (hdr.flags & 0x0010) {
                subj = `Re_${subj}`;
            }
        } else {
            subj = 'None_subject';
        }

        if (allowEditSubject) {
            const returns = {
                subject: subj,
                returnsubject: null,
                moveToTrash,
                resulte: false
            };

            const win = Services.wm.getMostRecentWindow(null);
            //https://github.com/Quantumplation/chrome-promise/blob/e9bb2819b2ae0ec942292c68ae084451d07b6290/chrome-promise.d.ts#L2132
            //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Extension_pages
            win.create
            win.openDialog('chrome://findnow/content/ui/editsubject.html', 'dlg', 'modal', returns);

            if (!returns.resulte) {
                return null;
            }

            subj = returns.returnsubject;

            if (subj) {
                console.log(subj);
            }
        }

        return null;
    }

}