const db = require('../config/mongodb.js');

async function getAccountByID(callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.findOne({ _id: 10000001 });
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

module.exports = {
	getAccountByID,
};
