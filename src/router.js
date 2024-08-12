const account = require('./api/accountApi.js');

const routes = [account];

function router(app) {
	routes.forEach((route) => {
		route(app);
	});
}

module.exports = router;
