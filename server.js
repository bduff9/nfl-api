'use strict';

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

/**
 * Server file for json-server
 */

server.use(middlewares);
server.get('/:year/export', (request, response) => {
	const { year } = request.params,
			{ W } = request.query;
	//TODO when request comes in, check if year requested exists
	//TODO if not, call download
	//TODO update data by setting game statuses for P games with kickoffs in the past
	response.redirect(`/export?W=${W}`);
});
router.render = (request, response) => {
	const { data } =  response.locals;
	if (Array.isArray(data) && data.length === 1) return response.jsonp(data[0]);
	response.jsonp(data);
};
server.use(router);
server.listen(3003, () => {
	console.log('JSON Server is running...');
});
