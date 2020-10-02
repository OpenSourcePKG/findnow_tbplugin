"use strict";

const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

function load(win) {
    this.win = win;

    let element = win.document.getElementById("hdrArchiveButton");

    let toolbarbutton = win.document.createXULElement("toolbarbutton");
    toolbarbutton.setAttribute("id", "saveToFindnow");
    toolbarbutton.setAttribute("class", "toolbarbutton-1 msgHeaderView-button");
    toolbarbutton.setAttribute("image", "chrome://messenger/skin/icons/getmsg.svg");
    toolbarbutton.setAttribute("label", "LayDown");
    toolbarbutton.setAttribute("oncommand", "findnow_exporter.saveTo();");
    element.parentNode.insertBefore(toolbarbutton, element);

    //Services.prompt.alert(win, "Teste Titel", "Meine Message");
    console.log("Overlayer Findnow");
}

function unload(win) {
    win.document.getElementById("saveToFindnow").remove();
}

function init() {
    console.log("Test Findnow");

}