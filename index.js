#!/usr/bin/env node
'use strict';

const program = require('commander');

const { downloadJSON, updateJSON } = require('./update-data');

/**
 * CLI functionality
 */

const downloadOnly = async function downloadOnly (options) {
	const { kickoffs, year } = options;
	const apiOptions = { gameSpacingInMin: kickoffs, year };

	await downloadJSON(apiOptions);
};

const fullUpdate = async function fullUpdate (options) {
	const { kickoffs, year } = options.parent;
	const apiOptions = { gameSpacingInMin: kickoffs, year };

	await updateJSON(apiOptions);
};

program
	.version('0.0.1')
	.option('-k, --kickoffs [minutes]', 'Separate kickoffs manually (in minutes)', /^\d+$/)
	.option('-y, --year [year]', 'Year to get', /^\d\d\d\d$/);

program
	.command('download')
	.description('Manually update NFL API (download only)')
	.action(downloadOnly);

program
	.command('update')
	.description('Manually update NFL API')
	.action(fullUpdate);

program.parse(process.argv);
