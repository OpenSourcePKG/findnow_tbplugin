import {CreateData, Window} from 'mozilla-webext-types';
import {FindnowBrowser} from '../../api/findnow/FindnowBrowser';

declare const browser: FindnowBrowser;

/**
 * Helper window handler.
 */
export class WindowHandler {

    /**
     * Window data description.
     * @member {CreateData}
     */
    protected _windowData: CreateData;

    /**
     * The window ID from an open window.
     * @member {number}
     */
    protected _windowId = 0;

    /**
     * Is the window ready?
     * @member {boolean}
     */
    protected _isReady = false;

    /**
     * Message queue stack, for window loading waiting.
     * @member {object[]}
     */
    protected _messageQueue: object[] = [];

    /**
     * Constructor with window data init.
     * @param {CreateData} windowData
     */
    public constructor(windowData: CreateData) {
        this._windowData = windowData;

        browser.runtime.onMessage.addListener(async(message) => {
            if (('status' in message) && (message.status === 'loaded')) {
                this._isReady = true;

                for await (const aMessage of this._messageQueue) {
                    await this.sendMessage(aMessage);
                }

                this._messageQueue.length = 0;
            }
        });
    }

    /**
     * Send a message object to the window.
     * @param {object} message
     */
    public async sendMessage(message: object): Promise<void> {
        try {
            await browser.windows.get(this._windowId);
        } catch (e) {
            this._isReady = false;
        }

        if (this._isReady) {
            browser.runtime.sendMessage(message).then();
        } else {
            this._messageQueue.push(message);
        }
    }

    /**
     * Open the window, when the window exists, then set the focus.
     * @param {object} data
     * @returns {Window}
     */
    public async open(data?: object): Promise<Window> {
        let ret: Window|null;

        try {
            ret = await browser.windows.get(this._windowId);
            await browser.windows.update(this._windowId, {focused: true});
        } catch (e) {
            ret = await browser.windows.create(this._windowData);

            if (ret.id) {
                this._windowId = ret.id;
            }
        }

        if (data) {
            this.sendMessage(data).then();
        }

        return ret;
    }

    /**
     * Close the window and reset all variables.
     */
    public async close(): Promise<void> {
        try {
            await browser.windows.get(this._windowId);
            browser.windows.remove(this._windowId);

            this._windowId = 0;
            this._isReady = false;
        } catch (e) {
            console.log(e);
        }
    }

}