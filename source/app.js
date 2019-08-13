import { inbox } from "file-transfer";
import { readFileSync } from "fs";

const debug = true;
let defaultSettings = {};
let settings = defaultSettings;
let onSettingsChange;

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
 * Reads setting file
 */
inbox.onnewfile = () => {
	let fileName;
	while (fileName = inbox.nextFile()) {
		debug && console.log("File received: " + fileName);

		if (fileName === 'settings.cbor') {
			/* Load settings */
			loadSettings();

			/* Invoke callback function to apply settings */
			onSettingsChange(settings);
		}
	}
};

/**
 * Init. settings
 * @param {*} callback 
 */
export function initialize(callback) {
	/* Load stored settings if any at startup */
	loadSettings();

	/* Invoke callback function to apply settings */
	onSettingsChange = callback;
	onSettingsChange(settings);
}