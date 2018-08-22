#!/usr/bin/env node
'use strict';

const program = require('commander');

const { downloadJSON } = require('./download/download');
const { updateJSON } = require('./update/update');

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
