import {
    nsIStreamListener,
    Interfaces,
    nsIInputStream,
    nsIRequest,
    nsresult,
    Components as C, nsIMsgDBHdr
} from 'mozilla-webext-types';
import {SaveToOptions} from './SaveToOptions';
import {Utils} from './Utils';

declare const Components: C;
const {
    interfaces: Ci,
    classes: Cc
} = Components;

/**
 * Exporter stream listner for EML Export.
 */
export class ExporterListner implements nsIStreamListener {

    [x: string]: unknown;

    private _hdr: nsIMsgDBHdr;
    private _options: SaveToOptions;
    private _scriptStream?: any;
    private _emailtext: string = '';

    public constructor(hdr: nsIMsgDBHdr, options: SaveToOptions) {
        this._hdr = hdr;
        this._options = options;
    }

    public QueryInterface<I extends Interfaces[keyof Interfaces]>(aIID: I): I {
        return this as unknown as I;
    }

    public onDataAvailable(
        aRequest: nsIRequest,
        aInputStream: nsIInputStream,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _aOffset: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _aCount: number
    ): void {
        this._scriptStream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);

        this._scriptStream.init(aInputStream);

        this._emailtext += this._scriptStream.read(this._scriptStream.available());
    }

    public onStartRequest(aRequest: nsIRequest): void {
    }

    public onStopRequest(
        aRequest: nsIRequest,
        aStatusCode: nsresult
    ): void {
        try {
            this._scriptStream = null;

            const tags = this._hdr.getStringProperty('keywords');

            if (tags && this._emailtext.substring(0, 5000).includes('X-Mozilla-Keys')) {
                this._emailtext = `X-Mozilla-Keys: ${tags}\r\n${this._emailtext}`;
            }

            const subject = this._options.editsubject_subject;
            console.log(subject);
        } catch (et) {
            console.log(et);
        }
    }

}