import {SaveToOptions} from './inc/Exporter/SaveToOptions';

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
     * Exist a path.
     * @param {string} path
     * @returns {boolean}
     */
    existPath(path: string): Promise<boolean>;

    /**
     * Save a message to file.
     * @param {number} messageId - ID of a message
     * @param {SaveToOptions} options
     * @returns {boolean}
     */
    saveTo(messageId: number, options: SaveToOptions): Promise<boolean>;
}