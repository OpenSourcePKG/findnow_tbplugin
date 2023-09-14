import {FindnowBrowser} from '../../api/findnow/api';

declare const browser: FindnowBrowser;
/* eslint-env browser, webextensions */

/**
 * Translation the data-i18n.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Findnow::Translation: DOMContentLoaded');

    const elements = Array.from(document.querySelectorAll('[data-i18n]')) as HTMLElement[];

    for (const element of elements) {
        const messageName = element.dataset.i18n;
        console.log(`Findnow::Translation: messageName: ${messageName}`);

        if (messageName) {
            element.insertAdjacentText('beforeend', browser.i18n.getMessage(messageName));
        }
    }
});