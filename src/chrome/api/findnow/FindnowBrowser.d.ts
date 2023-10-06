import {ThunderbirdBrowser} from 'mozilla-webext-types';
import {IFindnow} from './IFindnow';

/**
 * Findow Browser extention.
 */
export declare interface FindnowBrowser extends ThunderbirdBrowser {

    /**
     * Findnow api implementation.
     * @member {IFindnow}
     */
    findnow: IFindnow;
}