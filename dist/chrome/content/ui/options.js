'use strict';

const FNOptions = {
    async onLoad() {
        console.log('Options');

        browser.findnow.getUtils(window);

        document.getElementById('defaultButton').checked =
            window.findnow_utils.IETprefs.getBoolPref('extensions.findnow.button.show_default');
        document.getElementById('addtimeCheckbox').checked =
            window.findnow_utils.IETprefs.getBoolPref('extensions.findnow.export.filenames_addtime');
    }
};

/**
 * register event
 */
window.addEventListener('load', FNOptions.onLoad, false);
