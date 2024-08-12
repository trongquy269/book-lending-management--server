const accountModel = require('../model/accountModel.js');

function getAccount(req, res) {
	accountModel.getAccountByID((err, result) => {
		if (err) {
			throw err;
		}

		console.log(result);
		res.status(200).json(result);
	});
}

module.exports = {
	getAccount,
};
