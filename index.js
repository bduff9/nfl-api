'use strict';

const request = require('request-promise');
const jsonfile = require('jsonfile');

const file = './db.json';

/**
 * All functions for nfl-api
 */

const updateJSON = async function updateJSON ({ year = new Date().getFullYear() }) {
  const apiURL = `http://www03.myfantasyleague.com/${year}/export?TYPE=nflSchedule&JSON=1&W=`;
  let yearObj = {
    metadata: {
      year,
      dateDownloaded: new Date(),
      dateUpdated: new Date()
    },
    export: []
  };
  for (let w = 1; w < 18; w++) {
    let body = await request.get(apiURL + w);
    let json = JSON.parse(body);
    json.W = w;
    yearObj.export.push(json);
    console.log(`Week ${w} fetched`);
  }
  console.log('All weeks fetched!');
  jsonfile.writeFileSync(file, yearObj);
};

module.exports = {
  updateJSON
};
