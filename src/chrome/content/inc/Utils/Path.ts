import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

export class Path {

    /**
     * Helper join, it doesn't exist in the browser.
     * @param {string[]} segments
     */
    public static async join(...segments: string[]): Promise<string> {
        const pf = await browser.runtime.getPlatformInfo();

        let separator = '/';

        if (pf.os === 'win') {
            separator = '\\';
        }

        // eslint-disable-next-line no-shadow
        const parts = segments.reduce<string[]>((parts, asegment) => {
            let segment = asegment;

            // Remove leading slashes from non-first part.
            if (parts.length > 0) {
                segment = segment.replace(/^\//u, '');
            }

            // Remove trailing slashes.
            segment = segment.replace(/\/$/u, '');

            return parts.concat(segment.split(separator));
        }, []);

        const resultParts: string[] = [];

        for (const part of parts) {
            if (part === '.') {
                // eslint-disable-next-line no-continue
                continue;
            }

            if (part === '..') {
                resultParts.pop();
                // eslint-disable-next-line no-continue
                continue;
            }

            resultParts.push(part);
        }

        return resultParts.join(separator);
    }

}