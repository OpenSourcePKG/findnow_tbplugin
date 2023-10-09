import {Components as C} from 'mozilla-webext-types';
import {nsIFile} from '../../../../../../mozilla-webext-types/src/WebExtensions/Base/nsIFile';

declare const Components: C;

const {
    classes: Cc,
    interfaces: Ci
} = Components;

/**
 * Utils object.
 */
export class Utils {

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

    /**
     * Helper file string to nsIFile convert.
     * @param {string} file
     * @param {boolean} isExistCheck
     * @returns {nsIFile|null}
     */
    public static fileStrToNsIFile(file: string, isExistCheck: boolean): nsIFile|null {
        const localFile = Components.classes['@mozilla.org/file/local;1']
        .createInstance(Components.interfaces.nsIFile);

        localFile.initWithPath(file);

        if (isExistCheck) {
            if (localFile.exists()) {
                return localFile;
            }

            return null;
        }

        return localFile;
    }

}