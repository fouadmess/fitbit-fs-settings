import * as cbor from 'cbor';
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";

const debug = true;
let settings = {};

/**
 * Sends the settings to the device
 */
function send() {
	debug && console.log('Send settings');

	/* Send settings to the watch */
	outbox.enqueue('settings.cbor', cbor.encode(settings))
		.then(ft => debug && console.log('settings sent'))
		.catch(error => console.log("Error sending settings: " + error));
}

/**
 * Initializes the settings
 * Restore any previously saved settings
 */
export function initialize(defaultSettings) {
	for (let index = 0; index < settingsStorage.length; index++) {
		let key = settingsStorage.key(index);
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

	/* Send default settings to the device */
	if (defaultSettings) {
		let hasDefaultSettings;
		for (const key in defaultSettings) {
			if (defaultSettings.hasOwnProperty(key) && !settingsStorage.getItem(key)) {
				let value = defaultSettings[key];
				settings[key] = flatten(value);
				settingsStorage.setItem(key, value);
				hasDefaultSettings = true;
			}
		}

		/* Send the settings to the device */
		if (hasDefaultSettings && settings && Object.keys(settings).length > 0) {
			debug && console.log('Send default settings')
			send();
		}
	}

	/* A user changes settings */
	settingsStorage.onchange = evt => {
		settings[evt.key] = JSON.parse(evt.newValue);

		for (const key in settings) {
			if (settings.hasOwnProperty(key)) {
				settings[key] = flatten(settings[key]);
			}
		}

		/* Send the settings to the device */
		send();
	};
}

/**
 * Flatten settings
 * @param {*} value 
 */
function flatten(value) {
	if (value && value.values && value.values.length > 0) {
		value = value.values[0].value || value.values[0].name;
	}

	return value;
}