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
     * Convert a string to filname friendly string.
     * @param {string} str
     * @returns {string}
     */
    public static strToFilenameStr(str: string): string {
        return str
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x19]/gu, '_')
        .replace(/[/\\:,<>*?"|]/gu, '_');
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