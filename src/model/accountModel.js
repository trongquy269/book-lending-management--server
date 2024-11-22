const db = require('../config/mongodb.js');

async function getAccountByID (callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.findOne({ _id: 10000001 });
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function login (username, callback) {
	try {
		const collection = await db.query('accounts');
		const result = await collection.findOne({ phone: username });
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function register ([name, username, password], callback) {
	try {
		const collection = await db.query('accounts');
		const result = await collection.insertOne({
			name,
			phone: username,
			password: password,
			role: 'customer',
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function getIdByPhone (phone, callback) {
	try {
		const collection = await db.query('accounts');
		const result = await collection.findOne({
			phone: phone,
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

module.exports = {
	getAccountByID,
	login,
	register,
	getIdByPhone,
};
