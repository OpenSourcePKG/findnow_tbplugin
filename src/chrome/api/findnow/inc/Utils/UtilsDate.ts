
export class UtilsDate {

    /**
     * Convert a date time to string with format ISO.
     * @param {number} secs
     * @param {boolean} addTime
     * @returns {string} Format YYYY-MM-DD hh-ii-ss.
     */
    public static dateToIsoStr(secs: number, addTime: boolean): string {
        const msgDate = new Date(secs * 1000);
        const msgDate8601 = msgDate.getFullYear();

        const month = `${msgDate.getMonth() + 1}`.padStart(2, '0');
        const day = `${msgDate.getDate()}`.padStart(2, '0');

        let msgDateIsostring = `${msgDate8601.toString()}-${month}-${day}`;

        if (addTime) {
            const hours = `${msgDate.getHours()}`.padStart(2, '0');
            const min = `${msgDate.getMinutes()}`.padStart(2, '0');
            const sec = `${msgDate.getSeconds()}`.padStart(2, '0');

            msgDateIsostring += ` ${hours}-${min}-${sec}`;
        }

        return msgDateIsostring;
    }

    /**
     * Convert a date time to string with format 8601.
     * @param {number} secs
     * @param {boolean} addTime
     * @returns {string} Format YYYYMMDDhhii.
     */
    public static dateTo8601Str(secs: number, addTime: boolean): string {
        const msgDate = new Date(secs * 1000);
        const msgDate8601 = msgDate.getFullYear();

        const month = `${msgDate.getMonth() + 1}`.padStart(2, '0');
        const day = `${msgDate.getDate()}`.padStart(2, '0');

        let msgDate8601string = msgDate8601.toString() + month + day;

        if (addTime) {
            const hours = `${msgDate.getHours()}`.padStart(2, '0');
            const min = `${msgDate.getMinutes()}`.padStart(2, '0');

            msgDate8601string += ` ${hours}${min}`;
        }

        return msgDate8601string;
    }

}