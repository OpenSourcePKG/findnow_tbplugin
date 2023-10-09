import {FindnowBrowser} from '../../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

/**
 * Helper tanslation object.
 */
export class Translation {

    /**
     * Search all elements on DOM document and translate "data-i18n" key to text.
     */
    public static lang(): void {
        console.log('Findnow::Translation: DOMContentLoaded');

        const elements = Array.from(document.querySelectorAll('[data-i18n]')) as HTMLElement[];

        for (const element of elements) {
            const messageName = element.dataset.i18n;
            console.log(`Findnow::Translation: messageName: ${messageName}`);

            if (messageName) {
                element.insertAdjacentText('beforeend', browser.i18n.getMessage(messageName));
            }
        }
    }

}