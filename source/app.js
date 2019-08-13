import { inbox } from "file-transfer";
import { readFileSync } from "fs";

const debug = true;
let defaultSettings = {};
let settings = defaultSettings;

/**
 * Loads settings from device memory
 */
function loadSettings() {
	try {
		/* Load settings file */
		settings = readFileSync("settings.cbor", "cbor");

		/* Merge with default settings */
		for (let key in defaultSettings) {
			if (!settings.hasOwnProperty(key)) {
				settings[key] = defaultSettings[key];
			}
		}
	} catch (e) {
		debug && console.log('No settings found, fresh install, applying default settings...');

		/* Apply default settings */
		settings = defaultSettings;
	}
}

/**
 * Init. settings
 * @param {*} callback 
 * @param {*} newFileCallback 
 */
export function initialize(callback, newFileCallback) {
	/* Load stored settings if any at startup */
	loadSettings();

	/* Invoke callback function to apply settings */
	callback(settings);

	/* Reads setting file */
	inbox.onnewfile = () => {
		let fileName;
		while (fileName = inbox.nextFile()) {
			debug && console.log("File received: " + fileName);

			if (fileName === 'settings.cbor') {
				/* Load settings */
				loadSettings();

				/* Invoke callback function to apply settings */
				callback(settings);
			}

			/* Process new file */
			if (newFileCallback) {
				newFileCallback(fileName);
			}
		}
	};
}