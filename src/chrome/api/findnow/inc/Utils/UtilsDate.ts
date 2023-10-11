
export class UtilsDate {

    /**
     * Convert a date time to string with format ISO.
     * @param {number} secs
     * @param {boolean} addTime
     * @returns {string}
     */
    public static dateToIsoStr(secs: number, addTime: boolean): string {
        const msgDate = new Date(secs * 1000);
        const msgDate8601 = msgDate.getFullYear();

        let month: string;
        let day: string;
        let hours: string;
        let min: string;
        let sec: number;

        if (msgDate.getMonth() < 9) {
            month = `0${msgDate.getMonth() + 1}`;
        } else {
            month = `${msgDate.getMonth() + 1}`;
        }

        if (msgDate.getDate() < 10) {
            day = `0${msgDate.getDate()}`;
        } else {
            day = `${msgDate.getDate()}`;
        }

        let msgDateIsostring = `${msgDate8601.toString()}-${month.toString()}-${day.toString()}`;

        if (addTime) {
            if (msgDate.getHours() < 10) {
                hours = `0${msgDate.getHours()}`;
            } else {
                hours = `${msgDate.getHours()}`;
            }

            if (msgDate.getMinutes() < 10) {
                min = `0${msgDate.getMinutes()}`;
            } else {
                min = `${msgDate.getMinutes()}`;
            }

            sec = msgDate.getSeconds();

            msgDateIsostring += ` ${hours.toString()}-${min.toString()}-${sec.toString()}`;
        }

        return msgDateIsostring;
    }

    /**
     * Convert a date time to string with format 8601.
     * @param {number} secs
     * @param {boolean} addTime
     * @returns {string}
     */
    public static dateTo8601Str(secs: number, addTime: boolean): string {
        const msgDate = new Date(secs * 1000);
        const msgDate8601 = msgDate.getFullYear();

        let month;
        let day;
        let hours;
        let min;

        if (msgDate.getMonth() < 9) {
            month = `0${msgDate.getMonth() + 1}`;
        } else {
            month = `${msgDate.getMonth() + 1}`;
        }

        if (msgDate.getDate() < 10) {
            day = `0${msgDate.getDate()}`;
        } else {
            day = `${msgDate.getDate()}`;
        }

        let msgDate8601string = msgDate8601.toString() + month.toString() + day.toString();

        if (addTime) {
            if (msgDate.getHours() < 10) {
                hours = `0${msgDate.getHours()}`;
            } else {
                hours = `${msgDate.getHours()}`;
            }

            if (msgDate.getMinutes() < 10) {
                min = `0${msgDate.getMinutes()}`;
            } else {
                min = `${msgDate.getMinutes()}`;
            }

            msgDate8601string += ` ${hours.toString()}${min.toString()}`;
        }

        return msgDate8601string;
    }

}