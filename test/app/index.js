import clock from "clock";
import document from "document";
import * as deviceSettings from "../../source/app";

let clockText = document.getElementById("clockText");
let dateText = document.getElementById("dateText");

//initialisation
clock.granularity = 'minutes';

function setTime(date) {
	clockText.text = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
}

clock.ontick = (evt) => setTime(evt.date);
setTime(new Date());


deviceSettings.initialize((data) => {
	console.warn(JSON.stringify(data));

	if (data.timeColor) {
		clockText.style.fill = data.timeColor;
	}

	if (data.dateColor) {
		dateText.style.fill = data.dateColor;
	}

	if (data.showDate !== undefined) {
		dateText.style.display = (data.showDate) ? 'inline' : 'none';
	}
});