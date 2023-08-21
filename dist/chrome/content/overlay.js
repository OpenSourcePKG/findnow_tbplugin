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

"use strict";

const Services = globalThis.Services || ChromeUtils.import(
  "resource://gre/modules/Services.jsm"
).Services;

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG = true;

/**
 * load
 * @param win
 */
function load(win) {
    if (DEBUG) {
        console.log("Findnow::overlay: load begin");
    }

    this.win = win;

    this.win.findnow_utils.FNwaitForWindow(win).then(() => {
        if (DEBUG) {
            console.log("Findnow::overlay::FNwaitForWindow: wait for window begin");
        }

        let element = win.document.getElementById("hdrArchiveButton");

        if (element === null) {
            if (DEBUG) {
                console.log(
                    "Findnow::overlay::FNwaitForWindow: Overlayer Findnow hdrArchiveButton not found! Maybe setup first your account?");
            }

            return;
        }

        let toolbarbutton = win.document.createXULElement("toolbarbutton");

        toolbarbutton.setAttribute("id", "saveToFindnow");
        toolbarbutton.setAttribute("class", "toolbarbutton-1 msgHeaderView-button message-header-view-button");
        toolbarbutton.setAttribute("image", "chrome://messenger/skin/icons/getmsg.svg");
        toolbarbutton.setAttribute("label", "Ablegen");
        toolbarbutton.setAttribute("oncommand", "findnow_exporter.saveTo();");

        if( !this.win.findnow_utils.IETprefs.getBoolPref("extensions.findnow.button_show_default") ) {
            toolbarbutton.setAttribute("style", "background-color: red;");
        }

        element.parentNode.insertBefore(toolbarbutton, element);

        if (DEBUG) {
            console.log("Findnow::overlay::FNwaitForWindow: finish");
        }
    });
}

/**
 * unload
 * @param win
 */
function unload(win) {
    win.document.getElementById("saveToFindnow").remove();
}

/**
 * init
 */
function init() {
    if (DEBUG) {
        console.log("Findnow::overlay: init");
    }
}