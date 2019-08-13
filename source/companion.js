import * as cbor from 'cbor';
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";

const debug = true;
let settings = {};

/**
 * A user changes settings
 */
settingsStorage.onchange = evt => {
	settings[evt.key] = JSON.parse(evt.newValue);

	for (const key in settings) {
		if (settings.hasOwnProperty(key)) {
			const value = settings[key];
			if (value && value.values && value.values.length > 0) {
				settings[key] = value.values[0].value || value.values[0].name;
			}
		}
	}

	debug && console.log('Send settings');

	/* Send settings to the watch */
	outbox.enqueue('settings.cbor', cbor.encode(settings))
		.then(ft => debug && console.log('settings sent'))
		.catch(error => console.log("Error sending settings: " + error));
};

/**
 * Initializes the settings
 * Restore any previously saved settings
 */
export function initialize() {
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
}