import {FindnowBrowser} from './api/findnow/api';

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

    // browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
    browser.messageDisplayAction.onClicked.addListener(async(tab) => {
        console.log(`Findnow tab.id: ${tab.id}`);

        if (tab.id) {
            const header = await browser.messageDisplay.getDisplayedMessage(tab.id);

            if (header) {
                await browser.findnow.saveTo(header.id);
            }
        }

        if (DEBUG) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();