'use strict';

const FNEditSubject = {
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

    async save() {
        var retVals = window.arguments[0];

        retVals.returnsubject = document.getElementById("subject_text").value;
        retVals.moveToTrash = document.getElementById("move_to_trash").checked;
        retVals.resulte = true;

        window.close();
    },

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