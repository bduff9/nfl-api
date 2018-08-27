'use strict';

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const { DB_FILE } = require('../constants');
const { updateJSON } = require('../update/update');

/**
 * Server file for json-server
 */
server.use(middlewares);
server.all('/:year/export', async function ({ params }, UUresponse, next) {
	const { year } = params;

	await updateJSON({ year });
	router.db.assign(require('require-uncached')(`../${DB_FILE}`)).write();
	next();
});

server.use(jsonServer.rewriter({
	'/:year/export\\?*W=:week': '/export?W=:week'
}));

router.render = (UUrequest, response) => {
	const { data } = response.locals;

	if (Array.isArray(data) && data.length === 1) return response.jsonp(data[0]);

	response.jsonp(data);
};

server.use(router);
server.listen(3003, () => {
	console.log('JSON Server is running...');
});
