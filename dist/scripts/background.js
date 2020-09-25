async function main() {
  // see https://github.com/thundernest/addon-developer-support/wiki/WindowListener-API:-Getting-Started

  // add preferences
  messenger.WindowListener.registerDefaultPrefs("defaults/preferences/preferences.js");

  // set chrome manifest
  messenger.WindowListener.registerChromeUrl([
    ["content",  "findnow",           "chrome/content/findnow/"],
    ["locale",   "findnow", "en-US",  "chrome/locale/en-US/findnow/"],
    ["locale",   "findnow", "de",     "chrome/locale/de/findnow/"]
    ]
  );

  // add option
  messenger.WindowListener.registerOptionsPage("chrome://findnow/content/findnowOptions.xhtml");

  messenger.WindowListener.registerWindow(
    "chrome://messenger/content/messenger.xul",
    "chrome://quicktext/content/scripts/messenger.js");
}

main();