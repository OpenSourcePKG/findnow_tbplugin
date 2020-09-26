async function main() {
  // init ConversionHelper
  await browser.ConversionHelper.registerChromeUrl([ ["content", "findnow", "chrome/content/"] ]);
  await browser.ConversionHelper.registerApiFolder("chrome://findnow/content/api/ConversionHelper/");

  // register and activate overlays
  await browser.ConversionHelper.setOverlayVerbosity(9);

  await browser.ConversionHelper.registerOverlay("chrome://messenger/content/messenger.xhtml", "chrome://findnow/content/findnow.xhtml");
  await browser.ConversionHelper.registerOverlay("chrome://messenger/content/messageWindow.xhtml", "chrome://findnow/content/findnow.xhtml");

  await browser.ConversionHelper.activateOverlays();

  // startup completed
  await messenger.ConversionHelper.notifyStartupCompleted();
}

main();