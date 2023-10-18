import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {SaveToOptions} from './SaveToOptions';

declare const browser: FindnowBrowser;

export class Exporter {

    /**
     * Save a message to options (path, name etc...).
     * @param {number} messageId
     * @param {SaveToOptions} options
     */
    public static async saveTo(messageId: number, options: SaveToOptions): Promise<void> {
        const rawMsgFile = await browser.messages.getRaw(messageId, {
            data_format: 'File'
        }) as File;

        if (rawMsgFile) {
            console.log(rawMsgFile);

            const msgUrl = URL.createObjectURL(rawMsgFile);
            console.log(msgUrl);
            console.log(options);

            const dId = await browser.downloads.download({
                url: msgUrl,
                filename: options.savefile,
                saveAs: true
            });

            if (dId) {
                if (options.moveToTrash) {
                    const dIs = await browser.downloads.search({
                        id: dId
                    });

                    if (dIs.length > 0) {
                        const dI = dIs[0];

                        if (dI.state === 'complete') {
                            browser.messages.delete([messageId], false);
                        } else {
                            console.log('DownloadItem is not complete!');
                        }
                    } else {
                        console.log('DownloadItems is empty!');
                    }
                } else {
                    console.log('Move to trash not activ.');
                }
            }
        }
    }

}