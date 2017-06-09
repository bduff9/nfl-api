'use strict';

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const { updateJSON } = require('./update-data');

/**
 * Server file for json-server
 */

server.use(middlewares);
server.all('/:year/export', async function (request, response, next) {
	const { year } = request.params;
	await updateJSON({ year });
	router.db.assign(require('require-uncached')('./db.json')).write();
	next();
});
server.use(jsonServer.rewriter({
	'/:year/export/': '/export?'
}));
router.render = (request, response) => {
	const { data } =  response.locals;
	if (Array.isArray(data) && data.length === 1) return response.jsonp(data[0]);
	response.jsonp(data);
};
server.use(router);
server.listen(3003, () => {
	console.log('JSON Server is running...');
});
