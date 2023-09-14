import {ThunderbirdBrowser} from 'mozilla-webext-types';

export declare interface Findnow {
    saveTo(messageId: number): Promise<boolean>;
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