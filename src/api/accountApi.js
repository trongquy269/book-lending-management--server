const accountCtrl = require('../controller/accountCtrl.js');

function accountApi (app) {
	app.use('/', accountCtrl.isLogin);
	app.get('/api/account', accountCtrl.getAccount);
	app.post('/api/login', accountCtrl.login);
	app.post('/api/register', accountCtrl.register);
	app.post('/api/logout', accountCtrl.logout);
	app.get('/api/user/info', accountCtrl.getUserInfoByCookie);
}

module.exports = accountApi;
