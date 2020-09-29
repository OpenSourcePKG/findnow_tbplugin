'use strict';

var {Services} = ChromeUtils.import('resource://gre/modules/Services.jsm');
var {ExtensionSupport} = ChromeUtils.import('resource:///modules/ExtensionSupport.jsm');

var findnow = class extends ExtensionCommon.ExtensionAPI {

    constructor(extension) {
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

        ExtensionSupport.registerWindowListener('FindNow@hw-softwareentwicklung.de', {

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

        ExtensionSupport.unregisterWindowListener('FindNow@hw-softwareentwicklung.de');

        this.chromeHandle.destruct();
        this.chromeHandle = null;
    }

    getAPI(context) {
        return {
            findnow: {
                init() {
                    let prefs = Services.prefs.getDefaultBranch('extensions.findnow.');

                    prefs.setBoolPref('export.overwrite', true);
                    prefs.setBoolPref('export.set_filetime', false);
                    prefs.setBoolPref('exportEML.use_dir', false);
                    prefs.setBoolPref('log.enable', false);
                    prefs.setStringPref('export.filename_charset', '');
                    prefs.setIntPref('delay.clean_statusbar', 5000);
                    prefs.setBoolPref('export.filenames_toascii', true);
                    prefs.setBoolPref('export.filenames_addtime', true);
                    prefs.setIntPref('exportEML.filename_format', 2);
                    prefs.setBoolPref('export.cut_subject', true);
                    prefs.setBoolPref('export.cut_filename', true);
                    prefs.setBoolPref('export.filename_add_prefix', false);
                    prefs.setBoolPref('export.filename_useisodate', true);
                    prefs.setBoolPref('export.save_auto_eml', false);
                    prefs.setStringPref('export.filename_pattern', '%d %s-%k');
                    prefs.setStringPref(
                        'export.charset_list',
                        'ARMSCII-8,GEOSTD8,ISO-8859-1,ISO-8859-2,ISO-8859-3,ISO-8859-4,ISO-8859-5,ISO-8859-6,ISO-8859-7,ISO-8859-8,ISO-8859-9,ISO-8859-10,ISO-8859-11,ISO-8859-12,ISO-8859-13,ISO-8859-14,ISO-8859-15,ISO-8859-16,KOI8-R,KOI8-U,UTF-8,UTF-8 (BOM),WINDOWS-1250,WINDOWS-1251,WINDOWS-1252,WINDOWS-1253,WINDOWS-1254,WINDOWS-1255,WINDOWS-1256,WINDOWS-1257,WINDOWS-1258'
                    );
                    prefs.setBoolPref('button.show_default', false);
                    prefs.setBoolPref('exportEML.use_sub_dir', false);
                },

                click() {
                    let recentWindow = Services.wm.getMostRecentWindow('');

                    if (recentWindow) {
                        recentWindow.findnow.init();
                    }
                }
            }
        };
    }
};

// ------------------------------------------------------------------------------------------------

function loadWindow(win) {
console.log(win.location.href);
    switch (win.location.href) {
        case 'chrome://messenger/content/messenger.xhtml':
        case 'chrome://messenger/content/messageWindow.xhtml':

            win.findnow = {};

            Services.scriptloader.loadSubScript('chrome://findnow/content/overlay.js', win.findnow);

            win.findnow.i18n = findnow.i18n;
            win.findnow.load(win);

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