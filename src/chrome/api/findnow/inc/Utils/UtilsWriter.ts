import {Components as C, nsIFile} from 'mozilla-webext-types';

declare const Components: C;

const {
    classes: Cc,
    interfaces: Ci
} = Components;

/**
 * Helper for writing.
 */
export class UtilsWriter {

    /**
     * Write date to disk by a file.
     * @param {nsIFile} file
     * @param {string} data
     * @param {boolean} append
     * @param {[string]} fname
     * @param {[number]} time
     * @returns {boolean}
     */
    public static writeDataOnDisk(file: nsIFile, data: string, append: boolean, fname?: string, time?: number): boolean {
        try {
            const foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);

            if (append) {
                if (fname) {
                    file.append(fname);
                }

                foStream.init(file, 26, 0o664, 0);
            } else {
                foStream.init(file, 42, 0o664, 0);
            }

            if (data) {
                foStream.write(data, data.length);
            }

            foStream.close();

            try {
                if (time) {
                    file.lastModifiedTime = time;
                }
            } catch (e) {
                console.log(e);
            }

            return true;
        } catch (ex) {
            console.log(ex);
        }

        return false;
    }

}