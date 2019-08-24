#!/usr/bin/env node
'use strict';

const commander = require('commander');
const program = new commander.Command();

const { downloadJSON } = require('../download/download');
const { updateJSON } = require('../update/update');

/**
 * CLI functionality
 */
const downloadOnly = async function downloadOnly ({ parent }) {
	await downloadJSON(parent);
};

const fullUpdate = async function fullUpdate ({ parent }) {
	await updateJSON(parent);
};

program
	.version('0.0.2')
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

// Assert that a VALID command is provided
if (!process.argv.slice(2).length || !/(download|update)/.test(process.argv[2])) {
	program.outputHelp();
	process.exit();
}

program.parse(process.argv);
