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

if (DEBUG) {
    console.log('Findnow background.js');
}

if (browser) {
    browser.findnow.init();
} else {
    console.log('Findnow::background: browser object not found!');
}