const db = require('../config/mongodb.js');
const { ObjectId } = require('mongodb');

async function getAllBooks (callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.find({}).toArray();
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function addNewBook ([
	                           name, category, author, issuer, releaseDate, price,
	                           quantity, description, imagesLink,
                           ], callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.insertOne({
			title: name,
			category: category,
			author: author,
			issuer: issuer,
			price: price,
			quantity: quantity,
			description: description,
			image: imagesLink,
			release_date: releaseDate,
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function getBookById (bookId, callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.findOne({ _id: new ObjectId(bookId) });
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function getBookSameCategory ([category, neId], callback) {
	try {
		const collection = await db.query('books');
		const result = await collection.find({
			category: category,
			_id: { $ne: new ObjectId(neId) },
		}).toArray();
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function addNewLend ([userId, bookId, timeString], callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.insertOne({
			userId: new ObjectId(userId),
			bookId: new ObjectId(bookId),
			timeString: timeString,
			state: 'waiting',
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function getBookLending ([userId, bookId], callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.findOne({
			userId: new ObjectId(userId),
			bookId: new ObjectId(bookId),
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function removeLend ([userId, bookId], callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.deleteOne({
			userId: new ObjectId(userId),
			bookId: new ObjectId(bookId),
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function getAllLending (callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.aggregate([
			{
				// Lookup account details
				$lookup: {
					from: 'accounts',
					localField: 'userId',
					foreignField: '_id',
					as: 'accountInfo',
				},
			},
			{
				// Lookup book details
				$lookup: {
					from: 'books',
					localField: 'bookId',
					foreignField: '_id',
					as: 'bookInfo',
				},
			},
			{
				// Unwind the arrays to simplify access
				$unwind: '$accountInfo',
			},
			{
				$unwind: '$bookInfo',
			},
			{
				// Project the required fields
				$project: {
					_id: 1,
					userName: '$accountInfo.name',
					userPhone: '$accountInfo.phone',
					bookTitle: '$bookInfo.title',
					bookAuthor: '$bookInfo.author',
					lendingTime: '$timeString',
					approvedTime: '$approvedTime',
					returnTime: '$returnTime',
					state: 1,
				},
			},
		]).toArray();
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function approveLend ([id, timeString], callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					state: 'approved',
					approvedTime: timeString,
				},
			},
		);
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function returnLend ([id, timeString], callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					state: 'return',
					returnTime: timeString,
				},
			},
		);
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

async function removeLendById (id, callback) {
	try {
		const collection = await db.query('lending');
		const result = await collection.deleteOne({
			_id: new ObjectId(id),
		});
		callback(null, result);
	} catch (err) {
		callback(err, null);
	}
}

module.exports = {
	getAllBooks,
	addNewBook,
	getBookById,
	getBookSameCategory,
	addNewLend,
	getBookLending,
	removeLend,
	getAllLending,
	approveLend,
	returnLend,
	removeLendById,
};
