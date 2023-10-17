import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

/**
 * Subject helper object.
 */
export class Subject {

    /**
     * Return the subject by a message.
     * @param {number} messageId
     * @returns {string}
     */
    public static async getSubject(messageId: number): Promise<string> {
        const messageFull = await browser.messages.getFull(messageId);
        let subj;

        if (messageFull.headers) {
            if (messageFull.headers.subject) {
                subj = (messageFull.headers.subject as string[])[0];
            }
        }

        if (!subj) {
            const message = await browser.messages.get(messageId);

            subj = message.subject;
        }

        console.log(subj);

        return subj;
    }

}