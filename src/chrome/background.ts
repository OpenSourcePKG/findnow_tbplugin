import {FindnowBrowser} from './api/findnow/api';
import {Settings} from './content/inc/Settings';
import {WindowEditsubject} from './content/inc/Window/WindowEditsubject';

declare const browser: FindnowBrowser;

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG = true;

/**
 * Main
 */
(async(): Promise<void> => {
    if (DEBUG) {
        console.log('Findnow::background: init');
    }

    if (typeof browser === 'undefined') {
        console.error('Findnow::background: browser object is not defined!');
        return;
    }

    if (DEBUG) {
        console.log('Findnow::background: browser scripts loaded.');
    }

    // https://komari.co.jp/blog/9261/

    const winEditSubject = new WindowEditsubject();

    // browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
    browser.messageDisplayAction.onClicked.addListener(async(tab) => {
        console.log(`Findnow tab.id: ${tab.id}`);

        if (tab.id) {
            const header = await browser.messageDisplay.getDisplayedMessage(tab.id);

            if (header) {
                const settings = await new Settings().get();

                if (settings.allow_edit_subject) {
                    const win = winEditSubject.open({
                        header,
                        settings
                    });
                }

                // https://github.com/thunderbird-conversations/thunderbird-conversations/blob/7c1334532f10a532d72407f7133de0b2cd50ac5e/addon/experiment-api/schema.json
                /*const resulte = await browser.findnow.saveTo(header.id, {
                    editsubject_subject: 'Test',
                    editsubject_move_to_trash: true
                });

                console.log(resulte);*/
            }
        }

        if (DEBUG) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();