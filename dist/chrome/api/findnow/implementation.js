/*
 * This file is provided by
 * Company Pegenau GmbH & Co. KG
 *
 * Info: info@pegenau.de
 * Author: Stefan Werfling (stefan.werfling@pegenau.de)
 *
 * Special thanks to:
 * John Bieling (john@thunderbird.net)
 *
 * Credits:
 * ImportExportTools NG (https://github.com/thundernest/import-export-tools-ng)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

var Services = globalThis.Services || ChromeUtils.import(
  'resource://gre/modules/Services.jsm'
).Services;

var {ExtensionSupport} = ChromeUtils.import('resource:///modules/ExtensionSupport.jsm');

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG = true;

/**
 * findnow extension api
 * @type {findnow}
 */
var findnow = class extends ExtensionCommon.ExtensionAPI {

    /**
     * constructor
     * @param extension
     */
    constructor(extension) {
        if (DEBUG) {
            console.log("Test constructor");
        }

        super(extension);
        findnow.i18n = extension.localeData;
        findnow._prefs = null;
    }

    /**
     * onStartup
     */
    onStartup() {
        this._initPref();

        // -------------------------------------------------------------------------------------------------------------

        const aomStartup = Cc['@mozilla.org/addons/addon-manager-startup;1'].getService(Ci.amIAddonManagerStartup);
        const manifestURI = Services.io.newURI('manifest.json', null, this.extension.rootURI);

        this.chromeHandle =
            aomStartup.registerChrome(
                manifestURI,
                [
                    [
                        'content',
                        'findnow',
                        'chrome/content/'
                    ]
                ]
            );

        ExtensionSupport.registerWindowListener('findnow@pegenau.de', {

            chromeURLs: [
                'chrome://messenger/content/messenger.xhtml',
                'chrome://messenger/content/messageWindow.xhtml'
            ],

            onLoadWindow: loadWindow,
            onUnloadWindow: unloadWindow

        });


    }

    /**
     * _initPref
     * @private
     */
    _initPref() {
        if (DEBUG) {
            console.log('Set Prefs');
        }

        findnow._prefs = Services.prefs;
        let dprefs = findnow._prefs.getDefaultBranch('extensions.findnow.');

        dprefs.setBoolPref('export_overwrite', true);
        dprefs.setBoolPref('export_set_filetime', false);
        dprefs.setBoolPref('log_enable', false);
        dprefs.setStringPref('export_filename_charset', '');
        dprefs.setIntPref('delay_clean_statusbar', 5000);
        dprefs.setBoolPref('export_filenames_toascii', true);
        dprefs.setBoolPref('export_filenames_addtime', true);
        dprefs.setIntPref('export_eml_filename_format', 2);
        dprefs.setBoolPref('export_cut_subject', true);
        dprefs.setBoolPref('export_cut_filename', true);
        dprefs.setBoolPref('export_filename_add_prefix', false);
        dprefs.setBoolPref('export_filename_useisodate', true);
        dprefs.setBoolPref('export_save_auto_eml', false);
        dprefs.setStringPref('export_filename_pattern', '%d %s-%k');
        dprefs.setStringPref(
            'export_charset_list',
            'ARMSCII-8,GEOSTD8,ISO-8859-1,ISO-8859-2,ISO-8859-3,ISO-8859-4,ISO-8859-5,ISO-8859-6,ISO-8859-7,ISO-8859-8,ISO-8859-9,ISO-8859-10,ISO-8859-11,ISO-8859-12,ISO-8859-13,ISO-8859-14,ISO-8859-15,ISO-8859-16,KOI8-R,KOI8-U,UTF-8,UTF-8 (BOM),WINDOWS-1250,WINDOWS-1251,WINDOWS-1252,WINDOWS-1253,WINDOWS-1254,WINDOWS-1255,WINDOWS-1256,WINDOWS-1257,WINDOWS-1258'
        );
        dprefs.setBoolPref('button_show_default', false);

        dprefs.setBoolPref('export_eml_use_dir', false);
        dprefs.setStringPref('export_eml_dir', '');

        dprefs.setBoolPref('export_eml_use_sub_dir', false);
        dprefs.setStringPref('export_eml_sub_dir', '');


        dprefs.setBoolPref('use_filename_abbreviation', false);
        dprefs.setStringPref('filename_abbreviation', '');

        dprefs.setBoolPref('allow_edit_subject', false);
        dprefs.setBoolPref('move_to_trash', false);
    }

    /**
     * onShutdown
     */
    onShutdown() {
        for (let win of Services.wm.getEnumerator('findnow')) {
            Services.prompt.alert(
                Services.wm.getMostRecentWindow('mail:3pane'),
                'FindNow',
                'FindNow gets disabled, removed or updated.\nPlease close all open windows of FindNow, then click "OK".'
            );

            this.onShutdown();
            return;

        }

        for (let win of Services.wm.getEnumerator('msgcompose')) {
            unloadWindow(win);
        }

        Services.obs.notifyObservers(null, 'startupcache-invalidate', null);

        ExtensionSupport.unregisterWindowListener('findnow@pegenau.de');

        this.chromeHandle.destruct();
        this.chromeHandle = null;
    }

    /**
     * getAPI
     * return api definiation
     * @param context
     * @returns {null|{findnow}}
     */
    getAPI(context) {
        let prefs = findnow._prefs;

        const PREF_PREFIX = "extensions.findnow.";

        return {
            findnow: {

                /**
                 * init
                 * init findnow api
                 */
                init() {
                    if (DEBUG) {
                        console.log('Findnow Init');
                    }
                },

                /**
                 * click event
                 */
                click() {
                    let recentWindow = Services.wm.getMostRecentWindow('');

                    if (recentWindow) {
                        recentWindow.findnow.init();
                    }
                },

                /**
                 * getPref
                 * return pref
                 * @param atype variable type
                 * @param aName variable name
                 * @returns {null|*}
                 */
                getPref(atype, aName) {
                    aName = PREF_PREFIX + aName;

                    try {
                        switch (atype) {
                            case "string":
                                return prefs.getStringPref(aName);

                            case "integer":
                                return prefs.getIntPref(aName);

                            case "bool":
                                return prefs.getBoolPref(aName);

                            case "type":
                                return prefs.getPrefType(aName);
                        }
                    }
                    catch( ex ) {
                        if (DEBUG) {
                            console.log('error on pref:');
                        }

                        console.log(ex);
                    }

                    return null;
                },

                /**
                 * set pref
                 * @param atype variable type
                 * @param aName variable name
                 * @param aValue variable value
                 * @returns {*}
                 */
                setPref(atype, aName, aValue) {
                    const nName = PREF_PREFIX + aName;

                    switch( atype ) {
                        case "string":
                            if (typeof aValue !== 'string') {
                                if (DEBUG) {
                                    console.log('setPref->string: value is not a string!');
                                }

                                return;
                            }

                            try {
                                if (prefs.setStringPref) {
                                    return prefs.setStringPref(nName, aValue);
                                } else {
                                    let str = Cc['@mozilla.org/supports-string;1']
                                        .createInstance(Ci.nsISupportsString);

                                    str.data = aValue;

                                    return prefs.setComplexValue(nName, Ci.nsISupportsString, str);
                                }
                            } catch ( tex) {
                                console.log(tex);

                                try {
                                    return prefs.setCharPref(nName, aValue);
                                }
                                catch (tex2 ){
                                    console.log(tex2);
                                }
                            }
                            break;

                        case "int":
                        case "integer":
                            return prefs.setIntPref(nName, aValue);
                            break;

                        case "bool":
                            return prefs.setBoolPref(nName, aValue);
                            break;
                    }
                },

                /**
                 * setPrefDefault
                 * set default preferend
                 * @param atype
                 * @param aName
                 * @param aValue
                 */
                async setPrefDefault(atype, aName, aValue) {
                    if (await this.getPref('type', aName) == 0) {
                        await this.setPref(atype, aName, aValue);
                    }
                },

                /**
                 * pickFile
                 * pickup a file by extensionAPI
                 * @returns {Promise<null|*>}
                 */
                async pickFile() {
                    const fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);

                    let recentWindow = Services.wm.getMostRecentWindow('');

                    fp.init(recentWindow, '', Ci.nsIFilePicker.modeGetFolder);

                    let res = await new Promise(resolve => {
                        fp.open(resolve);
                    });

                    if (res === Ci.nsIFilePicker.returnOK) {
                        return fp.file.path;
                    }

                    return null;
                }
            }
        };
    }
}

// ------------------------------------------------------------------------------------------------

/**
 * loadWindow
 * load and register all findnow objects
 * @param win
 */
function loadWindow(win) {
    console.log(win.location.href);

    switch (win.location.href) {
        case 'chrome://messenger/content/messenger.xhtml':
        case 'chrome://messenger/content/messageWindow.xhtml':

            // -----------------------------------

            win.findnow_utils = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/utils.js', win.findnow_utils, 'UTF-8');

            win.findnow_utils.i18n = findnow.i18n;
            win.findnow_utils.load(win);

            // -----------------------------------

            win.findnow_exporter = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/exporter.js', win.findnow_exporter, 'UTF-8');

            win.findnow_exporter.i18n = findnow.i18n;
            win.findnow_exporter.load(win);

            // -----------------------------------

            win.findnow = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/overlay.js', win.findnow, 'UTF-8');

            win.findnow.i18n = findnow.i18n;
            win.findnow.load(win);

            // -----------------------------------
            break;

        default:
            ;

    }
}

/**
 * unloadWindow
 * unload and unregister all findnow objects
 * @param win
 */
function unloadWindow(win) {
    switch (win.location.href) {
        case 'chrome://messenger/content/messenger.xhtml':
        case 'chrome://messenger/content/messageWindow.xhtml':

            win.findnow.unload(win);
            delete win.findnow;

            win.findnow_exporter.unload(win);
            delete win.findnow_exporter;

            win.findnow_utils.unload(win);
            delete win.findnow_utils;

            break;

        default:
            ;
    }
}

/**
 * i18n
 * convert all i18n attributtes to lang
 * @param win
 */
function i18n(win) {
    let elements = win.document.querySelectorAll('[i18n]');

    for (let element of elements) {
        let attributes = element.getAttribute('i18n').split(';');

        for (let attribute of attributes) {
            if (attribute.includes('=')) {
                element.setAttribute(
                    attribute.split('=')[0],
                    win.findnow.i18n.localizeMessage(attribute.split('=')[1])
                );
            } else {
                element.textContent = win.findnow.i18n.localizeMessage(attribute);
            }
        }
    }
}
