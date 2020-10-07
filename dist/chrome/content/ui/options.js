'use strict';

const FNOptions = {
    async onLoad() {
        console.log('Options');

        const findnowbg = browser.extension.getBackgroundPage();
        const findnow = findnowbg.browser.findnow;

        document.getElementById('defaultButton').checked = await findnow.getPref('bool', 'button_show_default');
        document.getElementById('addtimeCheckbox').checked = await findnow.getPref('bool', 'export_filenames_addtime');

        if( await findnow.getPref('type',  "exportEML_dir") > 0 ) {
            document.getElementById("export_eml_dir").value = await findnow.getPref('string', "exportEML_dir");
        }

        if( await findnow.getPref('bool', "exportEML_use_dir") ) {
            document.getElementById("use_export_eml_dir").checked = true;

            document.getElementById("export_eml_dir").removeAttribute("disabled");
            document.getElementById("eml_dir_button").removeAttribute("disabled");
        }
        else {
            document.getElementById("use_export_eml_dir").checked = false;

            document.getElementById("export_eml_dir").setAttribute("disabled", "true");
            document.getElementById("eml_dir_button").setAttribute("disabled", "true");
        }

        // ---------------------------------------------------------------------

        if( await findnow.getPref('type', "exportEML_sub_dir") > 0 ) {
            document.getElementById("export_eml_sub_dir").value = await findnow.getPref('string',"exportEML_sub_dir");
        }

        document.getElementById("eml_dir_button").onclick = async function() {
            const path = await findnow.pickFile();
            console.log(path);
        };

        document.getElementById("use_export_eml_dir").onclick = function() {

        };
    }
};

/**
 * register event
 */
window.addEventListener('load', FNOptions.onLoad, false);
