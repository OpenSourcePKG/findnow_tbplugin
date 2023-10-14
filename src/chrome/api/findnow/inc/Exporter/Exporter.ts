import {Components as C, MailServices as MS} from 'mozilla-webext-types';
import {ExporterListner} from './ExporterListner';
import {SaveToOptions} from '../SaveToOptions';

declare const Components: C;

const {
    utils: Cu,
    interfaces: Ci
} = Components;

Cu.import('resource:///modules/MailServices.jsm');

declare const MailServices: MS;

export class Exporter {

    public async saveTo(msguri: string, options: SaveToOptions): Promise<any> {
        console.log(`msguri: ${msguri}`);

        const mms = MailServices.messageServiceFromURI(msguri).QueryInterface(Ci.nsIMsgMessageService);

        try {
            const hdr = mms.messageURIToMsgHdr(msguri);
            const emlListner = new ExporterListner(hdr, options);

            mms.streamMessage(
                msguri,
                emlListner,
                null,
                null,
                false,
                null
            );

            console.log(hdr);
        } catch (e) {

            console.log(`call to saveMsgAsEML - error = ${e}`);
            console.log(e);
        }
    }

}