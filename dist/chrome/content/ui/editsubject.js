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

/**
 * FNEditSubject
 * Dialog object
 * @type {{cancel(): Promise<void>, save(): Promise<void>, onLoad(): Promise<void>}}
 */
const FNEditSubject = {

    /**
     * onLoad
     * load edit subject object
     * @returns {Promise<void>}
     */
    async onLoad() {
        var retVals = window.arguments[0];

        document.getElementById("subject_text").value = retVals.subject;

        if( retVals.moveToTrash ) {
            document.getElementById("move_to_trash").checked = true;
        }
        else {
            document.getElementById("move_to_trash").checked = false;
        }
    },

    /**
     * save
     * save and close dialog
     * @returns {Promise<void>}
     */
    async save() {
        var retVals = window.arguments[0];

        retVals.returnsubject = document.getElementById("subject_text").value;
        retVals.moveToTrash = document.getElementById("move_to_trash").checked;
        retVals.resulte = true;

        window.close();
    },

    /**
     * cancel
     * close without action dialog
     * @returns {Promise<void>}
     */
    async cancel() {
        var retVals = window.arguments[0];

        retVals.resulte = false;

        window.close();
    }
};

/**
 * register event
 */
window.addEventListener('load', FNEditSubject.onLoad, false);