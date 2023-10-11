import {
    nsIStreamListener,
    Interfaces,
    nsIInputStream,
    nsIRequest,
    nsresult,
    Components as C, nsIMsgDBHdr,
    nsISupports
} from 'mozilla-webext-types';
import {UtilsFile} from '../Utils/UtilsFile';
import {UtilsWriter} from '../Utils/UtilsWriter';
import {SaveToOptions} from './../SaveToOptions';

declare const Components: C;
const {
    interfaces: Ci,
    classes: Cc,
    results: Cr
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
        console.log(`Findnow::ExporterListner: QueryInterface: ${aIID}`);

        if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
            return this as unknown as I;
        }

        return Cr.NS_NOINTERFACE as unknown as I;
    }

    public onDataAvailable(
        aRequest: nsIRequest,
        aInputStream: nsIInputStream,
        _aOffset: number,
        _aCount: number
    ): void {
        this._scriptStream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
        this._scriptStream.init(aInputStream);

        this._emailtext += this._scriptStream.read(this._scriptStream.available());
    }

    /**
     * Listner start reaquest, we're doing nothing and wait for stop.
     * @param {nsIRequest} aRequest
     */
    public onStartRequest(aRequest: nsIRequest): void {
        console.log(`Findnow::ExporterListner: onStartRequest: ${aRequest.name}`);
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

            const emlFile = UtilsFile.fileStrToNsIFile(this._options.savefile, false);

            if (emlFile) {
                emlFile.append('test.eml');

                const time = this._hdr.dateInSeconds * 1000;

                UtilsWriter.writeDataOnDisk(emlFile, this._emailtext, false, undefined, time);
            }
        } catch (et) {
            console.log(et);
        }
    }

    /**
     * Is obj equals to ExporterListner.
     * @param {nsISupports} obj
     * @returns {boolean}
     */
    public equals(obj: nsISupports): boolean {
        if (obj instanceof ExporterListner) {
            return true;
        }

        return false;
    }

}