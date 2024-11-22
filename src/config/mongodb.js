const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;
const client = new MongoClient(url);
let db;

async function connect() {
	if (!db) {
		try {
			await client.connect();
			console.log('Connected successfully to server');
			db = client.db(dbName);
		} catch (err) {
			console.error('Connection failed!');
			throw err;
		}
	}
}

connect();

async function query(collectionName) {
	if (!db) await connect();
	return db.collection(collectionName);
}

module.exports = { query };
