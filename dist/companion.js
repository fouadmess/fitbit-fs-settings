import * as cbor from 'cbor';
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";
var debug = true;
var settings = {};
function send() {
    debug && console.log('Send settings');
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) {
            settings[key] = flatten(settings[key]);
        }
    }
    outbox.enqueue('settings.cbor', cbor.encode(settings))
        .then(function (ft) { return debug && console.log('settings sent'); })
        .catch(function (error) { return console.log("Error sending settings: " + error); });
}
export function initialize(defaultSettings, onSettingChangedCallback) {
    settingsStorage.onchange = function (evt) {
        debug && console.log('Settings changed');
        if (onSettingChangedCallback) {
            onSettingChangedCallback(evt);
        }
        settings[evt.key] = JSON.parse(evt.newValue);
        send();
    };
    for (var index = 0; index < settingsStorage.length; index++) {
        var key = settingsStorage.key(index);
        if (key) {
            var value = settingsStorage.getItem(key);
            try {
                settings[key] = JSON.parse(value);
            }
            catch (ex) {
                settings[key] = value;
            }
        }
    }
    if (defaultSettings) {
        for (var key in defaultSettings) {
            if (defaultSettings.hasOwnProperty(key) && !settingsStorage.getItem(key)) {
                var value_1 = defaultSettings[key];
                settings[key] = value_1;
                settingsStorage.setItem(key, JSON.stringify(value_1));
            }
        }
    }
    send();
}
function flatten(value) {
    if (value && value.values && value.values.length > 0) {
        value = value.values[0].value || value.values[0].name;
    }
    return value;
}
//# sourceMappingURL=companion.js.map