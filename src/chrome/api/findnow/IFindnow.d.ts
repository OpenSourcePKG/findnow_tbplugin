import {SaveToOptions} from './inc/SaveToOptions';
import {SaveToResulte} from './inc/SaveToResulte';
import {SubjectOptions} from './inc/Subject/SubjectOptions';

/**
 * Interface for Findnow implementation.
 */
export declare interface IFindnow {

    /**
     * Save a message to file.
     * @param {number} messageId - ID of a message
     * @param {SaveToOptions} options
     * @returns {SaveToResulte}
     */
    saveTo(messageId: number, options: SaveToOptions): Promise<SaveToResulte>;

    /**
     * Return a path by user input select.
     * @param {string} defaultPath
     * @returns {string|null}
     */
    pickPath(defaultPath: string): Promise<string|null>;

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
     * Return the raw subject from message ID.
     * @param {number} messageId
     * @returns {string}
     */
    getRawSubject(messageId: number): Promise<string>;

    /**
     * Return a filename for eml.
     * @param {number} messageId
     * @param {SubjectOptions} options
     * @returns {string}
     */
    buildFilename(messageId: number, options: SubjectOptions): Promise<string>;

}