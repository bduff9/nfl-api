'use strict';

const jsonfile = require('jsonfile');

const { DB_FILE, HIGH_SCORE, LOW_SCORE } = require('../constants');
const { downloadJSON, getNowInSeconds } = require('../download/download');

/**
 * Update existing data only
 *
 * Only downloads data if db is empty
 */
const getDB = async function getDB (doDownload, { gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	let gameObj = jsonfile.readFileSync(`./${DB_FILE}`, { throws: false });

	if (!doDownload) return gameObj;

	if (gameObj == null || gameObj.metadata == null || gameObj.metadata.year != year) {
		await downloadJSON({ kickoffs: gameSpacingInMin, year });

		gameObj = jsonfile.readFileSync(`./${DB_FILE}`, { throws: false });
	} else {
		console.log('Year already up to date!');
	}

	return gameObj;
};

const randomScore = () => Math.floor(LOW_SCORE + (Math.random() * HIGH_SCORE));

const updateJSON = async function updateJSON ({ kickoffs: gameSpacingInMin = 0, year = new Date().getFullYear() } = {}) {
	const gameObj = await getDB(true, { gameSpacingInMin, year });
	let hasUpdated = false;

	gameObj.export.forEach(week => {
		const games = week.nflSchedule.matchup;
		const currentTS = getNowInSeconds();

		games.forEach(game => {
			if (game.gameSecondsRemaining > 0 && game.kickoff <= currentTS) {
				hasUpdated = true;
				game.gameSecondsRemaining = 0;
				game.team.forEach(team => team.score = randomScore());
			}
		});
	});

	if (hasUpdated) {
		gameObj.metadata.dateUpdated = new Date();
		jsonfile.writeFileSync(`./${DB_FILE}`, gameObj);
		console.log('Date has been updated!');
	} else {
		console.log('Data is already updated!');
	}
};

module.exports = {
	randomScore,
	updateJSON
};
