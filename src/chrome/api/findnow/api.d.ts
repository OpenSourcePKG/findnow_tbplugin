import {ThunderbirdBrowser} from 'mozilla-webext-types';

export declare interface Findnow {

    /**
     * Save a message to file.
     * @param {number} messageId - Id of a message
     * @returns {boolean}
     */
    saveTo(messageId: number): Promise<boolean>;

    /**
     * Return a path by user input select.
     * @returns {string|null}
     */
    pickPath(): Promise<string|null>;
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