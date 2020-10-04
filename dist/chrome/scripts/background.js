"use strict";

browser.findnow.init();
browser.composeAction.onClicked.addListener(function() { browser.findnow.click(); });
browser.runtime.onUpdateAvailable.addListener(function() { /* null */ });