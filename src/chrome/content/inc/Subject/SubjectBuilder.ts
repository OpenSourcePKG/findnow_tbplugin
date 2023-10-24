import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';
import {File} from '../Utils/File';
import {Str} from '../Utils/Str';
import {UtilsDate} from '../Utils/UtilsDate';
import {SubjectOptions} from './SubjectOptions';

declare const browser: FindnowBrowser;

/**
 * Subject builder object.
 */
export class SubjectBuilder {

    /**
     * Replace and format the string to useable name.
     * @param {string} str
     * @param {boolean} isRecipients
     * @returns {string}
     */
    public static formatName(str: string, isRecipients: boolean): string {
        if (isRecipients) {
            return str.replace(/\s*,.+/u, '');
        }

        if (str.indexOf('<') > -1) {
            return str.replace(/\s*<.+>/u, '');
        }

        return str.replace(/[@.]/gu, '_');
    }

    /**
     * Create the filename from mail (subject etc...).
     * @param {number} messageId
     * @param {SubjectOptions} options
     */
    public static async buildFilename(
        messageId: number,
        options: SubjectOptions
    ): Promise<string> {
        const msg = await browser.messages.get(messageId);
        const subMaxLen = options.cutSubject ? 50 : -1;
        let subj = options.subject.trim();
        let fname = '';

        if (options.use_abbreviation) {
            subj = `${options.abbreviation.trim()} ${subj}`;
        }

        if (subMaxLen > 0) {
            subj = subj.substring(0, subMaxLen);
        }

        // convert to ascii for speciel chars by subject ---------------------------------------------------------------

        if (options.filenames_toascii) {
            subj = File.strToFilenameStr(subj);
        } else {
            subj = Str.strToAscii(subj);
        }

        // date --------------------------------------------------------------------------------------------------------
        let strDate = '';

        if (options.use_iso_date) {
            strDate = UtilsDate.dateToIsoStr(
                msg.date,
                options.add_time_to_name
            );
        } else {
            strDate = UtilsDate.dateTo8601Str(
                msg.date,
                options.add_time_to_name
            );
        }

        // build full name by format type ------------------------------------------------------------------------------

        switch (options.filenameFormat) {
            default:
                fname = `${strDate} ${subj}-${msg.id}`;
        }

        // eslint-disable-next-line no-control-regex
        fname = fname.replace(/[\x00-\x1F]/gu, '_');

        if (options.filenames_toascii) {
            fname = Str.strToAscii(fname);
        } else {
            fname = fname.replace(/[/\\:,<>*?"|']/gu, '_');
        }

        if (options.cutFilename) {
            const maxFN = 249 - options.dirPath.length;

            if (fname.length > maxFN) {
                fname = fname.substring(0, maxFN);
            }
        }

        return fname;
    }

}