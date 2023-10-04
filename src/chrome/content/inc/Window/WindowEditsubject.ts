import {Window} from 'mozilla-webext-types';
import {SendMessageEditSubject} from '../SendMessageEditSubject';
import {WindowHandler} from '../WindowHandler';

/**
 * This is the window edit subject.
 */
export class WindowEditsubject extends WindowHandler {

    public constructor() {
        super({
            url: 'chrome/content/ui/editsubject.html',
            type: 'popup',
            allowScriptsToClose: true,
            width: 420,
            height: 200
        });
    }

    /**
     * Implement open with data structur.
     * @param {SendMessageEditSubject} data
     */
    public async open(data?: SendMessageEditSubject): Promise<Window> {
        return super.open(data);
    }

}