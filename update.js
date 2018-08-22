'use strict';

const jsonfile = require('jsonfile');

const file = './db.json';
const { downloadJSON } = require('./download');
const LOW_SCORE = 0;
const HIGH_SCORE = 64;

/**
 * Update existing data only
 *
 * Only downloads data if db is empty
 */
const getDB = async function getDB (doDownload, { gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	let gameObj = jsonfile.readFileSync(file, { throws: false });

	if (!doDownload) return gameObj;

	if (gameObj == null || gameObj.metadata == null || gameObj.metadata.year != year) {
		await downloadJSON({ gameSpacingInMin, year });

		gameObj = jsonfile.readFileSync(file, { throws: false });
	} else {
		console.log('Year already up to date!');
	}

	return gameObj;
};

const randomScore = () => Math.floor(LOW_SCORE + (Math.random() * HIGH_SCORE));

const updateJSON = async function updateJSON ({ gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const gameObj = await getDB(true, { gameSpacingInMin, year });
	const weeks = gameObj.export;
	let hasUpdated = false;

	weeks.forEach(week => {
		const games = week.nflSchedule.matchup;
		const currentTS = Math.floor(new Date().getTime() / 1000);

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
	updateJSON
};
