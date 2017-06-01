'use strict';

const request = require('request-promise');
const jsonfile = require('jsonfile');

const file = './db.json';

/**
 * All functions for nfl-api
 */

const downloadJSON = async function downloadJSON ({ gameSpacing = 0, year = new Date().getFullYear() }) {
	const apiURL = `http://www03.myfantasyleague.com/${year}/export?TYPE=nflSchedule&JSON=1&W=`;
	let yearObj = {
		metadata: {
			year,
			dateDownloaded: new Date(),
			dateUpdated: new Date()
		}
	},
	exporter = [];
	for (let w = 1; w < 18; w++) {
		let body = await request.get(apiURL + w);
		let json = JSON.parse(body);
		// Update json here as needed
		if (gameSpacing > 0) {
			//TODO
		}
		json.W = w;
		exporter.push(json);
		console.log(`Week ${w} fetched`);
	}
	console.log('All weeks fetched!');
	yearObj.export = exporter;
	jsonfile.writeFileSync(file, yearObj);
};

const updateJSON = async function updateJSON ({ gameSpacing = 0, year = new Date().getFullYear() }) {
	let gameObj = {};
	gameObj = jsonfile.readFileSync(file, { throws: false });
	if (gameObj == null || gameObj.metadata.year !== year) {
		await downloadJSON({ gameSpacing, year });
		gameObj = jsonfile.readFileSync(file, { throws: false });
	}
	//TODO loop through games
	//TODO if game has 3600 seconds remaining and kickoff < now, set seconds remaining to 0 and update random scores for both teams
	//TODO if any game updated above, update lastUpdated in obj and save back to file
};

module.exports = {
	downloadJSON,
	updateJSON
};
