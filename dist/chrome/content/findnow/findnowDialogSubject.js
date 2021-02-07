/* global ChromeUtils */

Components.utils.import("resource://gre/modules/Services.jsm");

/**
 *
 * FindNow Options
 */

if( typeof com_hw_FindNow === "undefined" ) {
    var com_hw_FindNow = {};
};

/**
 * options object
 * @type findnow_L15.exp|Function
 */
com_hw_FindNow.subjectdialog = function() {

    // -------------------------------------------------------------------------

    var subject = {};

    /**
     * init
     * @returns {undefined}
     */
    subject.init = function() {

    }

    /**
     * load
     * @returns {undefined}
     */
    subject.load = function() {
        var retVals = window.arguments[0];

        document.getElementById("subject_text").value = retVals.subject;

        if( retVals.moveToTrash ) {
            document.getElementById("move_to_trash").checked = true;
        }
        else {
            document.getElementById("move_to_trash").checked = false;
        }
    }

    /**
     * save
     * @returns {undefined}
     */
    subject.save = function() {
        var retVals = window.arguments[0];

        retVals.returnsubject = document.getElementById("subject_text").value;
        retVals.moveToTrash = document.getElementById("move_to_trash").checked;
    }

    return subject;
}();

/**
 * init
 */
com_hw_FindNow.subjectdialog.init();

/**
 * addEventListener - load
 */
window.addEventListener("load", function(event) {
    com_hw_FindNow.subjectdialog.load();
});

/**
 * addEventListener - dialogaccept
 * @param {type} param1
 * @param {type} param2
 */
document.addEventListener("dialogaccept", function(event) {
    com_hw_FindNow.subjectdialog.save();
});