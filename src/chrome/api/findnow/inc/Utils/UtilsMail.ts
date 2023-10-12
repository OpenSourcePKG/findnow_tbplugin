import {Components as C, nsIMsgDBHdr, MailServices as MS, nsIMsgFolder} from 'mozilla-webext-types';

declare const Components: C;

const {
    utils: Cu,
    interfaces: Ci
} = Components;

Cu.import('resource:///modules/MailUtils.jsm');
Cu.import('resource:///modules/MailServices.jsm');

declare const MailServices: MS;
declare const MailUtils: any;

/**
 * Utils Mail helper object.
 */
export class UtilsMail {

    /**
     * Move a Message to a folder.
     * @param {nsIMsgDBHdr} msgHdr
     * @param {nsIMsgFolder} toFolder
     */
    public static moveTo(msgHdr: nsIMsgDBHdr, toFolder: nsIMsgFolder): boolean {
        try {
            if (msgHdr.folder.URI !== toFolder.URI) {
                MailServices.copy.copyMessages(
                    msgHdr.folder,
                    [msgHdr],
                    toFolder,
                    true,
                    null,
                    null,
                    true
                );

                return true;
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    /**
     * Return a Messagehead by URI.
     * @param {string} msgURI - Message URI.
     * @returns {nsIMsgDBHdr|null}
     */
    public static getMsgHdr(msgURI: string): nsIMsgDBHdr | null {
        return MailServices.messageServiceFromURI(msgURI).messageURIToMsgHdr(msgURI);
    }

    /**
     * Get by the Email source, over the root folder, the trash folder.
     * @param {nsIMsgDBHdr} msgHdr - Messagehead
     * @returns {nsIMsgFolder} Returns the trash folder
     */
    public static getTrashFolder(msgHdr: nsIMsgDBHdr): nsIMsgFolder {
        const folder = MailUtils.getExistingFolder(msgHdr.folder.URI);
        const rootFolder = folder.rootFolder;

        return rootFolder.getFolderWithFlags(Ci.nsMsgFolderFlags.Trash);
    }

}