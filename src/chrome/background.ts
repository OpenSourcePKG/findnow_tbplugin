import {FindnowBrowser} from './api/findnow/FindnowBrowser';
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
                    const fileDest = await Folder.getSaveFolder(settings);

                    if (fileDest === '') {
                        return;
                    }

                    const filename = await SubjectBuilder.buildFilename(header.id, {
                        subject: header.subject,
                        dirPath: fileDest,
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

                    if (fileDest !== '') {
                        newfile = await Path.join(fileDest, newfile);
                    }

                    if (await browser.findnow.saveTo(header.id, {
                        savefile: newfile
                    })) {
                        if (settings.move_to_trash) {
                            if (header.folder && header.folder.type !== 'trash') {
                                browser.messages.delete([header.id], false);
                            }
                        }
                    }
                }
            }
        }

        if (Debug.is()) {
            console.log(`Message displayed in tab ${tab.id}`);
        }
    });
})();