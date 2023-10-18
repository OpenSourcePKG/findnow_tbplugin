import {FindnowBrowser} from './api/findnow/FindnowBrowser';
import {Exporter} from './content/inc/Exporter/Exporter';
import {Settings} from './content/inc/Settings';
import {SubjectBuilder} from './content/inc/Subject/SubjectBuilder';
import {SubjectBuilderFormat} from './content/inc/Subject/SubjectBuilderFormat';
import {Debug} from './content/inc/Utils/Debug';
import {Folder} from './content/inc/Utils/Folder';
import {Path} from './content/inc/Utils/Path';
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
                    const path = await Folder.getSaveFolder(settings);
                    const filename = await SubjectBuilder.buildFilename(header.id, {
                        subject: header.subject,
                        dirPath: path,
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

                    let newfile = `${filename}.eml`;

                    if (path !== '') {
                        newfile = await Path.join(path, newfile);
                    }

                    await Exporter.saveTo(header.id, {
                        savefile: newfile,
                        moveToTrash: settings.move_to_trash
                    });
                }
            }
        }

        if (Debug.is()) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();