import { inbox } from "file-transfer";
import { readFileSync } from "fs";
var debug = true;
var defaultSettings = {};
var settings = defaultSettings;
function loadSettings() {
    try {
        settings = readFileSync("settings.cbor", "cbor");
        for (var key in defaultSettings) {
            if (!settings.hasOwnProperty(key)) {
                settings[key] = defaultSettings[key];
            }
        }
    }
    catch (e) {
        debug && console.log('No settings found, fresh install, applying default settings...');
        settings = defaultSettings;
    }
}
export function initialize(callback, newFileCallback) {
    loadSettings();
    callback(settings);
    inbox.onnewfile = function () {
        var fileName;
        while (fileName = inbox.nextFile()) {
            debug && console.log("File received: " + fileName);
            if (fileName === 'settings.cbor') {
                loadSettings();
                callback(settings);
            }
            if (newFileCallback) {
                newFileCallback(fileName);
            }
        }
    };
}
//# sourceMappingURL=app.js.map