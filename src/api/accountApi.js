const accountCtrl = require('../controller/accountCtrl.js');

function accountApi(app) {
	app.get('/api/account', accountCtrl.getAccount);
}

module.exports = accountApi;
