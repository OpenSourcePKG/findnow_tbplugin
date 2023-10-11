/**
 * Helper for string converts.
 */
export class UtilsStr {

    /**
     * Convert a string to ascii string.
     * @param {string} str
     * @returns {string}
     */
    public static strToAscii(str: string): string {
        return str
        .replace(/\n/gu, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[<>:"/\\|?*\x00-\x1F]| +$/gu, '')
        .replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/u, (x) => `${x}_`);
    }

}