import {FindnowBrowser} from '../../../api/findnow/api';

declare const browser: FindnowBrowser;

export class Translation {

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