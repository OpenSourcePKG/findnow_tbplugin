import {FindnowBrowser} from './api/findnow/FindnowBrowser';
import {SubjectBuilder} from './api/findnow/inc/Subject/SubjectBuilder';
import {Settings} from './content/inc/Settings';
import {Folder} from './content/inc/Utils/Folder';
import {WindowEditsubject} from './content/inc/Window/WindowEditsubject';

declare const browser: FindnowBrowser;

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG: boolean = true;

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

    const winEditSubject = new WindowEditsubject();

    browser.messageDisplayAction.onClicked.addListener(async(tab) => {
        console.log(`Findnow tab.id: ${tab.id}`);

        if (tab.id) {
            const header = await browser.messageDisplay.getDisplayedMessage(tab.id);

            if (header) {
                const settings = await new Settings().get();
                const file = await Folder.getSaveFolder(settings);

                if (file) {
                    if (settings.allow_edit_subject) {
                        await winEditSubject.open({
                            header,
                            settings,
                            file
                        });
                    } else {
                        const filename = await browser.findnow.buildFilename(header.id, {
                            subject: '',
                            dirPath: file,
                            filenames_toascii: true,
                            cutFilename: true,
                            use_abbreviation: settings.use_filename_abbreviation,
                            abbreviation: settings.filename_abbreviation,
                            add_time_to_name: settings.export_filenames_addtime,
                            cutSubject: true,
                            filenameFormat: SubjectBuilder.FILENAME_FORMAT_SIMPLE,
                            use_iso_date: true,
                            pattern: ''
                        });

                        const newfile = await browser.findnow.joinPath(file, `${filename}.eml`);

                        await browser.findnow.saveTo(header.id, {
                            savefile: newfile,
                            editsubject_move_to_trash: settings.move_to_trash
                        });
                    }
                } else {
                    console.log('Destination can not use for email save!');
                }
            }
        }

        if (DEBUG) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();