const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// Database Name
const dbName = 'book-lending-management';

// function collection(collectionName) {
// 	// Use connect method to connect to the server
// 	return client
// 		.connect()
// 		.then(() => {
// 			console.log('Connected successfully to server');

// 			const db = client.db(dbName);
// 			return db.collection(collectionName);
// 		})
// 		.catch((err) => {
// 			console.error('Connection failed!');
// 			throw err;
// 		});
// }

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
