import {nsIMsgDBHdr} from 'mozilla-webext-types';
import {UtilsDate} from '../Utils/UtilsDate';
import {UtilsFile} from '../Utils/UtilsFile';
import {UtilsStr} from '../Utils/UtilsStr';
import {SubjectOptions} from './SubjectOptions';


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
     * @param {nsIMsgDBHdr} msgHdr
     * @param {SubjectOptions} options
     */
    public static buildFilename(msgHdr: nsIMsgDBHdr, options: SubjectOptions): string {
        const subMaxLen = options.cutSubject ? 50 : -1;
        let subj = options.subject;
        let fname = '';

        if (options.use_abbreviation) {
            subj = `${options.abbreviation} ${subj}`;
        }

        if (subMaxLen > 0) {
            subj = subj.substring(0, subMaxLen);
        }

        // convert to ascii for speciel chars by subject ---------------------------------------------------------------

        if (options.filenames_toascii) {
            subj = UtilsFile.strToFilenameStr(subj);
        } else {
            subj = UtilsStr.strToAscii(subj);
        }

        // date --------------------------------------------------------------------------------------------------------
        const dateInSec = msgHdr.dateInSeconds;
        let strDate = '';

        if (options.use_iso_date) {
            strDate = UtilsDate.dateToIsoStr(
                dateInSec,
                options.add_time_to_name
            );
        } else {
            strDate = UtilsDate.dateTo8601Str(
                dateInSec,
                options.add_time_to_name
            );
        }

        // build full name by format type ------------------------------------------------------------------------------

        switch (options.filenameFormat) {
            default:
                fname = `${strDate} ${subj}-${msgHdr.messageKey}`;
        }

        // eslint-disable-next-line no-control-regex
        fname = fname.replace(/[\x00-\x1F]/gu, '_');

        if (options.filenames_toascii) {
            fname = UtilsStr.strToAscii(fname);
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