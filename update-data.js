'use strict';

const jsonfile = require('jsonfile');
const request = require('request-promise');

const file = './db.json';

const LOW_SCORE = 0;
const HIGH_SCORE = 64;

/**
 * All functions for nfl-api
 */
const downloadJSON = async function downloadJSON ({ gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const apiURL = `http://www03.myfantasyleague.com/${year}/export?TYPE=nflSchedule&JSON=1&W=`;
	let yearObj = {
				metadata: {
					year,
					dateDownloaded: new Date(),
					dateUpdated: new Date()
				}
			},
			exporter = [],
			currentTS = Math.floor(new Date().getTime() / 1000);
	for (let w = 1; w < 18; w++) {
		let body = await request.get(apiURL + w);
		let json = JSON.parse(body);
		// Update json here as needed
		if (gameSpacingInMin > 0) {
			const games = json.nflSchedule.matchup,
					spacingInSec = gameSpacingInMin * 60;
			games.forEach(game => {
				currentTS += spacingInSec;
				game.kickoff = `${currentTS}`;
			});
		}
		json.W = w;
		exporter.push(json);
		console.log(`Week ${w} fetched`);
	}
	console.log('All weeks fetched!');
	yearObj.export = exporter;
	jsonfile.writeFileSync(file, yearObj);
};

const getDB = async function getDB (doDownload, { gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
  let gameObj = jsonfile.readFileSync(file, { throws: false });
	if (!doDownload) return gameObj;
	if (gameObj === null || gameObj.metadata.year != year) {
		await downloadJSON({ gameSpacingInMin, year });
		gameObj = jsonfile.readFileSync(file, { throws: false });
	} else {
		console.log('Year already up to date!');
	}
	return gameObj;
};

const randomScore = function randomScore () {
	return Math.floor(LOW_SCORE + (Math.random() * HIGH_SCORE));
};

const updateJSON = async function updateJSON ({ gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const gameObj = await getDB(true, { gameSpacingInMin, year }),
      weeks = gameObj.export;
	let hasUpdated = false;
	weeks.forEach(week => {
		const games = week.nflSchedule.matchup,
				currentTS = Math.floor(new Date().getTime() / 1000);
		games.forEach(game => {
			if (game.gameSecondsRemaining > 0 && game.kickoff <= currentTS) {
				const teams = game.team;
				hasUpdated = true;
				game.gameSecondsRemaining = 0;
				teams.forEach(team => team.score = randomScore());
			}
		});
	});
	if (hasUpdated) {
		gameObj.metadata.dateUpdated = new Date();
		jsonfile.writeFileSync(file, gameObj);
		console.log('Date has been updated!');
	} else {
		console.log('Data is already updated!');
	}
};

module.exports = {
	downloadJSON,
	updateJSON
};
