import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {SaveToOptions} from '../../../api/findnow/inc/SaveToOptions';

declare const browser: FindnowBrowser;

export class Exporter {

    public static async saveTo(messageId: number, options: SaveToOptions): Promise<void> {
        const rawMsgFile = await browser.messages.getRaw(messageId, {
            data_format: 'File'
        }) as File;

        if (rawMsgFile) {
            console.log(rawMsgFile);

            const msgUrl = URL.createObjectURL(rawMsgFile);
            console.log(msgUrl);

            const dI = await browser.downloads.download({
                url: msgUrl,
                filename: options.savefile,
                saveAs: true
            });

            console.log(dI);
        }
    }

}