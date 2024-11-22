const account = require('./api/accountApi.js');
const book = require('./api/bookApi.js');

const routes = [account, book];

function router(app) {
	routes.forEach((route) => {
		route(app);
	});
}

module.exports = router;
