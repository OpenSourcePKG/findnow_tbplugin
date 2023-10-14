import {FindnowBrowser} from './api/findnow/FindnowBrowser';
import {SubjectBuilderFormat} from './api/findnow/inc/Subject/SubjectBuilderFormat';
import {Settings} from './content/inc/Settings';
import {Debug} from './content/inc/Utils/Debug';
import {Folder} from './content/inc/Utils/Folder';
import {WindowEditsubject} from './content/inc/Window/WindowEditsubject';

declare const browser: FindnowBrowser;

/**
 * Main
 */
(async(): Promise<void> => {
    if (Debug.is()) {
        console.log('Findnow::background: init');
    }

    if (typeof browser === 'undefined') {
        console.error('Findnow::background: browser object is not defined!');
        return;
    }

    if (Debug.is()) {
        console.log('Findnow::background: browser scripts loaded.');
    }

    const winEditSubject = new WindowEditsubject();

    browser.messageDisplayAction.onClicked.addListener(async(tab) => {
        console.log(`Findnow tab.id: ${tab.id}`);

        if (tab.id) {
            const header = await browser.messageDisplay.getDisplayedMessage(tab.id);

            if (header) {
                const settings = await new Settings().get();

                if (settings.allow_edit_subject) {
                    await winEditSubject.open({
                        header,
                        settings
                    });
                } else {
                    const file = await Folder.getSaveFolder(settings);

                    if (file) {
                        const filename = await browser.findnow.buildFilename(header.id, {
                            subject: header.subject,
                            dirPath: file,
                            filenames_toascii: true,
                            cutFilename: true,
                            use_abbreviation: settings.use_filename_abbreviation,
                            abbreviation: settings.filename_abbreviation,
                            add_time_to_name: settings.export_filenames_addtime,
                            cutSubject: true,
                            filenameFormat: SubjectBuilderFormat.SIMPLE,
                            use_iso_date: true,
                            pattern: ''
                        });

                        const newfile = await browser.findnow.joinPath(file, `${filename}.eml`);

                        await browser.findnow.saveTo(header.id, {
                            savefile: newfile,
                            editsubject_move_to_trash: settings.move_to_trash
                        });
                    } else {
                        console.log('Destination can not use for email save!');
                    }
                }
            }
        }

        if (Debug.is()) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();