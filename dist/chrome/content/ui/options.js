'use strict';

const FNOptions = {
    async onLoad() {
        console.log('Options');

        const findnowbg = browser.extension.getBackgroundPage();
        const findnow = findnowbg.browser.findnow;

        document.getElementById('defaultButton').checked = await findnow.getPref('bool', 'button_show_default');
        document.getElementById('addtimeCheckbox').checked = await findnow.getPref('bool', 'export_filenames_addtime');

        if( await findnow.getPref('type',  "export_eml_dir") > 0 ) {
            document.getElementById("export_eml_dir").value = await findnow.getPref('string', "export_eml_dir");
        }

        if( await findnow.getPref('bool', "export_eml_use_dir") ) {
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

        if( await findnow.getPref('type',  "export_eml_sub_dir") > 0 ) {
            document.getElementById("export_eml_sub_dir").value = await findnow.getPref('string', "export_eml_sub_dir");
        }

        if( await findnow.getPref('bool', "export_eml_use_sub_dir") ) {
            document.getElementById("use_export_eml_sub_dir").checked = true;
            document.getElementById("export_eml_sub_dir").removeAttribute("disabled");
        }
        else {
            document.getElementById("use_export_eml_sub_dir").checked = false;
            document.getElementById("export_eml_sub_dir").setAttribute("disabled", "true");
        }

        document.getElementById("eml_dir_button").onclick = async function() {
            const path = await findnow.pickFile();
            document.getElementById("export_eml_dir").value = path;
        };

        document.getElementById("use_export_eml_dir").onclick = function() {
            const isChecked = document.getElementById("use_export_eml_dir").checked;

            if( isChecked ) {
                document.getElementById("export_eml_dir").removeAttribute("disabled");
                document.getElementById("eml_dir_button").removeAttribute("disabled");
            }
            else {
                document.getElementById("export_eml_dir").setAttribute("disabled", "true");
                document.getElementById("eml_dir_button").setAttribute("disabled", "true");
            }
        };

        document.getElementById("use_export_eml_sub_dir").onclick = function() {
            const isChecked = document.getElementById("use_export_eml_sub_dir").checked;

            if( isChecked ) {
                document.getElementById("export_eml_sub_dir").removeAttribute("disabled");
            }
            else {
                document.getElementById("export_eml_sub_dir").setAttribute("disabled", "true");
            }
        };

        // row use_filename_abbreviation
        document.getElementById('use_filename_abbreviation').checked = await findnow.getPref('bool', 'use_filename_abbreviation');

        document.getElementById("use_filename_abbreviation").onclick = function() {
            const isChecked = document.getElementById("use_filename_abbreviation").checked;

            if( isChecked ) {
                document.getElementById("filename_abbreviation").removeAttribute("disabled");
            }
            else {
                document.getElementById("filename_abbreviation").setAttribute("disabled", "true");
            }
        };

        if( await findnow.getPref('type',  "filename_abbreviation") > 0 ) {
            document.getElementById("filename_abbreviation").value = await findnow.getPref('string', "filename_abbreviation");
        }

        // row allow_edit_subject
        document.getElementById('allow_edit_subject').checked = await findnow.getPref('bool', 'allow_edit_subject');

        // row move to trash
        document.getElementById('move_to_trash').checked = await findnow.getPref('bool', 'move_to_trash');

        // -----------------------------------------------------------------------

        document.getElementById("commonsave").onclick = async function() {
            await findnow.setPref('bool', 'button_show_default', document.getElementById("defaultButton").checked);
            await findnow.setPref('bool', 'export_filenames_addtime', document.getElementById("addtimeCheckbox").checked);
            await findnow.setPref('bool', 'export_eml_use_dir', document.getElementById("use_export_eml_dir").checked);

            const exportemldir = document.getElementById("export_eml_dir").value;

            if( exportemldir !== "" ) {
                await findnow.setPref('string', 'export_eml_dir', exportemldir);
            }

            await findnow.setPref('bool', 'export_eml_use_sub_dir', document.getElementById("use_export_eml_sub_dir").checked);

            if( document.getElementById("export_eml_sub_dir").value !== "" ) {
                await findnow.setPref(
                    'string',
                    'export_eml_sub_dir',
                    document.getElementById("export_eml_sub_dir").value
                );
            }

            await findnow.setPref('bool', 'use_filename_abbreviation', document.getElementById("use_filename_abbreviation").checked);

            if( document.getElementById("filename_abbreviation").value !== "" ) {
                await findnow.setPref(
                    'string',
                    'filename_abbreviation',
                    document.getElementById("filename_abbreviation").value
                );
            }

            await findnow.setPref('bool', 'allow_edit_subject', document.getElementById("allow_edit_subject").checked);
            await findnow.setPref('bool', 'move_to_trash', document.getElementById("move_to_trash").checked);

            alert('Die Optionen wurden gespeichert.');
        };
    }
};

/**
 * register event
 */
window.addEventListener('load', FNOptions.onLoad, false);
