'use strict';

const jsonfile = require('jsonfile');
const request = require('request-promise');

const file = '../db.json';

const BETWEEN_GAMES_MIN = 60;

/**
 * All functions for nfl-api
 */
const processWeek = async function processWeek (apiOptions, week) {
	const { apiURL, gameSpacingInMin } = apiOptions;
	const json = JSON.parse(await request.get(apiURL + week));

	apiOptions.lastKickoff += (BETWEEN_GAMES_MIN * 60);
	json.W = week;

	if (gameSpacingInMin > 0) {
		json.nflSchedule.matchup.forEach(game => {
			apiOptions.lastKickoff += gameSpacingInMin * 60;
			game.kickoff = `${apiOptions.lastKickoff}`;
		});
	}

	console.log(`Week ${week} fetched`);

	return json;
};

const downloadJSON = async function downloadJSON ({ kickoffs: gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const apiURL = `http://www03.myfantasyleague.com/${year}/export?TYPE=nflSchedule&JSON=1&W=`;
	const apiOptions = { apiURL, lastKickoff: Math.floor(new Date().getTime() / 1000), gameSpacingInMin };
	let yearObj = {
		metadata: { year, dateDownloaded: new Date(), dateUpdated: new Date() }
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
