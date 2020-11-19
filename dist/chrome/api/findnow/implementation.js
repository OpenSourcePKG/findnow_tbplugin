'use strict';

var {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');
var {ExtensionSupport} = ChromeUtils.import('resource:///modules/ExtensionSupport.jsm');

var findnow = class extends ExtensionCommon.ExtensionAPI {

    constructor(extension) {
        console.log("Test constructor");
        super(extension);
        findnow.i18n = extension.localeData;
    }

    onStartup() {
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
                'chrome://messenger/content/messageWindow.xhtml',

                'chrome://findnow/content/findnow.xhtml'
            ],

            onLoadWindow: loadWindow,
            onUnloadWindow: unloadWindow

        });
    }

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

    getAPI(context) {
        /*let prefs = Cc["@mozilla.org/preferences-service;1"]
            .getService(Ci.nsIPrefBranch);*/
        //let prefs = Services.prefs.getDefaultBranch('extensions.findnow.');
        let prefs = Services.prefs;

        const PREF_PREFIX = "extensions.findnow.";

        return {
            findnow: {
                init() {
                    console.log('Set Prefs');

                    let dprefs = prefs.getDefaultBranch('extensions.findnow.');

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

                    // -----------------------------------------------------------------------
                },

                click() {
                    let recentWindow = Services.wm.getMostRecentWindow('');

                    if (recentWindow) {
                        recentWindow.findnow.init();
                    }
                },

                /**
                 * getPref
                 * @param atype
                 * @param aName
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
                        console.log('error on pref:');
                        console.log(ex);
                    }

                    return null;
                },

                setPref(atype, aName, aValue) {
                    const nName = PREF_PREFIX + aName;

                    switch( atype ) {
                        case "string":
                            if (typeof aValue !== 'string') {
                                console.log('setPref->string: value is not a string!');
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
                 * @param atype
                 * @param aName
                 * @param aValue
                 */
                async setPrefDefault(atype, aName, aValue) {
                    if (await this.getPref('type', aName) == 0) {
                        await this.setPref(atype, aName, aValue);
                    }
                },

                pickFile() {
                    const nsIFilePicker = Ci.nsIFilePicker;
                    const fp = Cc['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);

                    let recentWindow = Services.wm.getMostRecentWindow('');

                    fp.init(recentWindow, '', nsIFilePicker.modeGetFolder);

                    let res;

                    if (fp.show) {
                        res = fp.show();
                    } else {
                        let done = false;
                        let rv, result;

                        fp.open(function(result) {
                            rv = result;
                            done = true;
                        });

                        var thread = Components.classes['@mozilla.org/thread-manager;1'].getService().currentThread;

                        while (!done) {
                            thread.processNextEvent(true);
                        }

                        res = rv;
                    }

                    if (res === nsIFilePicker.returnOK) {
                        return fp.file.path;
                    }

                    return null;
                }
            }
        };
    }
}

// ------------------------------------------------------------------------------------------------

function loadWindow(win) {
    console.log(win.location.href);

    switch (win.location.href) {
        case 'chrome://messenger/content/messenger.xhtml':
        case 'chrome://messenger/content/messageWindow.xhtml':

            // -----------------------------------

            win.findnow_utils = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/utils.js', win.findnow_utils);

            win.findnow_utils.i18n = findnow.i18n;
            win.findnow_utils.load(win);

            // -----------------------------------

            win.findnow_exporter = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/exporter.js', win.findnow_exporter);

            win.findnow_exporter.i18n = findnow.i18n;
            win.findnow_exporter.load(win);

            // -----------------------------------

            win.findnow = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/overlay.js', win.findnow);

            win.findnow.i18n = findnow.i18n;
            win.findnow.load(win);

            // -----------------------------------
            break;

        case 'chrome://findnow/content/findnow.xhtml':
            win.findnow.i18n = findnow.i18n;
            i18n(win);

            break;

        default:
            ;

    }
}

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