#!/usr/bin/env node
'use strict';

const cli = require('cli');

const { downloadJSON, updateJSON } = require('./update-data');

/**
 * CLI functionality
 */

cli.parse({
	download: ['d', 'Download only?', 'on'],
	kickoffs: ['k', 'How far apart to make the kickoffs (in minutes)', 'int'],
	year: ['y', 'The year to download', 'int']
});

if (cli.download) {
	await downloadJSON({ gameSpacingInMin: cli.kickoffs, year: cli.year });
} else {
	await updateJSON({ gameSpacingInMin: cli.kickoffs, year: cli.year });
}
