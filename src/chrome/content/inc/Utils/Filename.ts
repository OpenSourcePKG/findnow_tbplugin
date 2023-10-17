import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

export class Filename {

    public static async build(messageId: number): Promise<string> {
        const message = await browser.messages.getFull(messageId);
        console.log(message);
        return '';
    }

}