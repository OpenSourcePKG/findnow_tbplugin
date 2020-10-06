"use strict";

console.log('Findnow background.js');

browser.findnow.init();
browser.runtime.onUpdateAvailable.addListener(function() { /* null */ });