'use strict';

const jsonfile = require('jsonfile');
const request = require('request-promise');

const file = './db.json';

const BETWEEN_GAMES_MIN = 60;

/**
 * All functions for nfl-api
 */
const processWeek = async function processWeek (apiOptions, week) {
	const { apiURL, gameSpacingInMin } = apiOptions;
	const body = await request.get(apiURL + week);
	const json = JSON.parse(body);

	apiOptions.lastKickoff += (BETWEEN_GAMES_MIN * 60);

	// Update json here as needed
	if (gameSpacingInMin > 0) {
		const games = json.nflSchedule.matchup;
		const spacingInSec = gameSpacingInMin * 60;

		games.forEach(game => {
			apiOptions.lastKickoff += spacingInSec;
			game.kickoff = `${apiOptions.lastKickoff}`;
		});
	}

	json.W = week;
	console.log(`Week ${week} fetched`);

	return json;
};

const downloadJSON = async function downloadJSON ({ gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const apiURL = `http://www03.myfantasyleague.com/${year}/export?TYPE=nflSchedule&JSON=1&W=`;
	const apiOptions = {
		apiURL,
		lastKickoff: Math.floor(new Date().getTime() / 1000),
		gameSpacingInMin
	};
	let yearObj = {
		metadata: {
			year,
			dateDownloaded: new Date(),
			dateUpdated: new Date()
		}
	};
	let exporter = [];

	for (let w = 1; w < 18; w++) exporter.push(await processWeek(apiOptions, w));

	console.log('All weeks fetched!');
	yearObj.export = exporter;
	jsonfile.writeFileSync(file, yearObj);
};

module.exports = {
	downloadJSON
};
