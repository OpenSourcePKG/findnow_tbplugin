/**
 * File helper object.
 */
export class File {

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

}