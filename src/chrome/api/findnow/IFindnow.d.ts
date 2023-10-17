import {SubjectOptions} from './inc/Subject/SubjectOptions';

/**
 * Interface for Findnow implementation.
 */
export declare interface IFindnow {

    /**
     * Return a path by user input select.
     * @param {string} defaultPath - The path is ignored when the string is empty.
     * @param {string} dlgTitle - Title for dialog.
     * @param {string} btnTitle - Title for button.
     * @returns {string|null}
     */
    showDirectoryPicker(defaultPath: string, dlgTitle: string, btnTitle: string): Promise<string|null>;

    /**
     * Joint 2 paths to a string
     * @param {string} path
     * @param {string} subdir
     * @returns {string}
     */
    joinPath(path: string, subdir: string): Promise<string>;

    /**
     * Exist a path.
     * @param {string} path
     * @returns {boolean}
     */
    existPath(path: string): Promise<boolean>;

    /**
     * Return a filename for eml.
     * @param {number} messageId
     * @param {SubjectOptions} options
     * @returns {string}
     */
    buildFilename(messageId: number, options: SubjectOptions): Promise<string>;

}