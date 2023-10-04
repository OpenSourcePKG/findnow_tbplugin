import {ThunderbirdBrowser} from 'mozilla-webext-types';
import {SaveToOptions} from './inc/SaveToOptions';
import {SaveToResulte} from './inc/SaveToResulte';

export declare interface Findnow {

    /**
     * Save a message to file.
     * @param {number} messageId - Id of a message
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
     * Return a created path.
     * @param {string} path - Path for creating.
     * @returns {string|null}
     */
    createPath(path: string): Promise<string|null>;
}

/**
 * Findow Browser extention.
 */
export declare interface FindnowBrowser extends ThunderbirdBrowser {

    /**
     * Findnow api implementation.
     * @member {Findnow}
     */
    findnow: Findnow;
}