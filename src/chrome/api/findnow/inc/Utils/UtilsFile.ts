import {Components as C, nsIFile} from 'mozilla-webext-types';

declare const Components: C;

/**
 * Helper for file object.
 */
export class UtilsFile {

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

    /**
     * Check is exist a file on disk.
     * @param {string} aFile
     * @returns {boolean}
     */
    public static existFile(aFile: string): boolean {
        try {
            const localFile = Components.classes['@mozilla.org/file/local;1']
            .createInstance(Components.interfaces.nsIFile);

            localFile.initWithPath(aFile);

            return localFile.exists();
        } catch (e) {
            console.log(e);
        }

        return false;
    }

}