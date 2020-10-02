#!/usr/bin/osascript
// Documentation: https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/System-Events#clicking-menu-items
// See targeting an app: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/AutomatetheUserInterface.html
// For Applescript documentation, go to Script Editor > File > Open Dictionary > Processes Suite

function run(argv) {
  var action = argv[0];
  var meetingId = argv[1]; // Not used - just an example of how to get workflow env variable

  var systemEvents = Application('System Events');
  systemEvents.strictPropertyScope = true;

  var zoom = Application('zoom.us');
  zoom.activate();
  delay(0.2);

  var zoomProcess = systemEvents.processes['zoom.us'];
  console.log('windows length: ', zoomProcess.windows.length);

  var zoomWindow = zoomProcess.windows[0];
  console.log('window description: ', zoomWindow.title());
  console.log('button length: ', zoomWindow.buttons.length);

  if (action === 'create') {
    systemEvents.keystroke('v', { using: ['command down', 'control down'] }) // Press control+cmd+v to create
    delay(3);

    systemEvents.keyCode(36) // Press enter to start audio
    delay(1);

    var copyLinkBtn = findButton(zoomWindow, 'Copy Link');
    if(!copyLinkBtn) {
      console.log('Did not find "Copy Link" button');
      return getAlfredReturn(false);
    }

    console.log('Found button: ', copyLinkBtn.description());

    copyLinkBtn.click();
    delay(0.2);
    console.log('Copied link');

    return getAlfredReturn(true);
  } else {
    systemEvents.keystroke('j', { using: 'command down' }) // Press cmd+j to join
    delay(0.2);

    systemEvents.keystroke('v', { using: 'command down' }) // Press cmd+v to paste meeting
    delay(0.2);

    systemEvents.keyCode(36) // Press enter to join
    return getAlfredReturn(false);
  }
}

function findButton(appWindow, buttonName) {
  for (i=0; i<appWindow.buttons.length; i++) {
    var btn = appWindow.buttons[i];

    if (btn.description() === buttonName) {
      return btn;
    }
  }

  return undefined;
}

function getAlfredReturn(isCopied) {
  var alfred = {
    alfredworkflow : {
      arg : isCopied,
      config : {},
      variables : {}
    }
  }

  return JSON.stringify(alfred);
}
