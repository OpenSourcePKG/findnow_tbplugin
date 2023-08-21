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

/**
 * DEBUG enable/disable
 * @type {boolean}
 */
const DEBUG = true;

/**
 * Main
 */
(async() => {
    if (DEBUG) {
        console.log('Findnow::background: init');
    }

    if (typeof browser === "undefined") {
        console.error('Findnow::background: browser object is not defined!');
        return;
    }

    let registeredScripts = await browser.composeScripts.register({
        js: [
            {
                file: '/content/utils.js'
            },
            {
                file: '/content/exporter.js'
            },
            {
                file: '/content/overlay.js'
            }
        ]
    });

    if (registeredScripts) {
        console.log('Findnow::background: browser scripts loaded.');
    }
})();

if (browser) {
    browser.findnow.init();

    browser.messageDisplay.onMessageDisplayed.addListener(async(tab, message) => {
        browser.tabs.executeScript(tab.id, {
            code: 'findnow_exporter.saveTo()'
        });
        console.log(`Message displayed in tab ${tab.id}: ${message.subject} - ${message.id}`);
    });
} else {
    console.log('Findnow::background: browser object not found!');
}