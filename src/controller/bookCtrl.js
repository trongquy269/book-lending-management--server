const bookModel = require('../model/bookModel.js');
const accountModel = require('../model/accountModel');
const fs = require('fs');
const path = require('path');
const { createSlug } = require('../utils.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function getAllBooks (req, res) {
	bookModel.getAllBooks((err, result) => {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Failed to fetch books', details: err.message });
		}

		res.status(200).json(result);
	});
}

async function addNewBook (req, res) {
	const name = req.body.name;
	const category = req.body.category;
	const author = req.body.author;
	const issuer = req.body.issuer;
	const releaseDate = req.body.releaseDate;
	const price = req.body.price;
	const quantity = req.body.quantity;
	const description = req.body.description;
	const images = req.body.images;
	const imagesLink = [];

	await images.forEach((image, index) => {
		// Decode the base64 string and save the file
		const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');
		const imageName =
			images.length === 1
			? `${createSlug(`${name}-${author.join('-')}`)}.${
				image.type.split('/')[1]
			}`
			: `${createSlug(`${name}-${author.join('-')}`)}${index}.${
				image.type.split('/')[1]
			}`;
		const filePath = path.join(__dirname, '..', 'images', imageName);
		imagesLink.push(`http://localhost:3000/assets/images/${imageName}`);

		fs.writeFileSync(filePath, buffer, (err) => {
			if (err) {
				throw err;
			}
		});
	});

	await bookModel.addNewBook([
		name, category, author, issuer, releaseDate, price, quantity, description, imagesLink,
	], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json({ message: 'success' });
	});
}

function getBook (req, res) {
	const bookId = req.query.bookId;

	bookModel.getBookById(bookId, (err, result) => {
		if (err) {
			throw err;
		}

		const category = result.category;

		bookModel.getBookSameCategory([category, bookId], (_err, _result) => {
			if (_err) {
				throw _err;
			}

			res.status(200).json({ result: result, same: _result });
		});
	});
}

async function lendHandler (req, res) {
	const bookId = req.body.bookId;
	let phone = '';
	let userId = '';
	const timeString = new Date().getTime();
	const cookies = req.headers.cookie;
	const token = cookies ? cookies.split('; ')
	                               .find(cookie => cookie.startsWith('token='))
	                               ?.split('=')[1] : null;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	await jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded) {
			phone = JSON.parse(decoded.data).phone;
		}
	});

	await accountModel.getIdByPhone(phone, (err, result) => {
		if (err) {
			throw err;
		}

		userId = result._id.toHexString();
	});

	await bookModel.addNewLend([userId, bookId, timeString], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json({ message: 'success' });
	});
}

async function checkLending (req, res) {
	const bookId = req.query.bookId;
	let phone = '';
	let userId = '';
	const timeString = new Date().getTime();
	const cookies = req.headers.cookie;
	const token = cookies ? cookies.split('; ')
	                               .find(cookie => cookie.startsWith('token='))
	                               ?.split('=')[1] : null;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	await jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded) {
			phone = JSON.parse(decoded.data).phone;
		}
	});

	await accountModel.getIdByPhone(phone, (err, result) => {
		if (err) {
			throw err;
		}

		userId = result._id.toHexString();
	});

	await bookModel.getBookLending([userId, bookId], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json({ state: result?.state || '', timeString: result?.timeString || null });
	});
}

async function cancelLendHandler (req, res) {
	const bookId = req.body.bookId;
	const id = req.body.id;

	if (bookId) {
		let phone = '';
		let userId = '';
		const cookies = req.headers.cookie;
		const token = cookies ? cookies.split('; ')
		                               .find(cookie => cookie.startsWith('token='))
		                               ?.split('=')[1] : null;

		if (!token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		await jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (decoded) {
				phone = JSON.parse(decoded.data).phone;
			}
		});

		await accountModel.getIdByPhone(phone, (err, result) => {
			if (err) {
				throw err;
			}

			userId = result._id.toHexString();
		});

		await bookModel.removeLend([userId, bookId], (err, result) => {
			if (err) {
				throw err;
			}

			res.status(200).json({ message: 'success' });
		});
	} else {
		await bookModel.removeLendById(id, (err, result) => {
			if (err) {
				throw err;
			}

			res.status(200).json({ message: 'success' });
		});
	}
}

function getAllLending (req, res) {
	bookModel.getAllLending((err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json(result);
	});
}

function approveHandler (req, res) {
	const id = req.body.id;
	const timeString = new Date().getTime();

	bookModel.approveLend([id, timeString], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json({ message: 'success' });
	});
}

function returnHandler (req, res) {
	const id = req.body.id;
	const timeString = new Date().getTime();

	bookModel.returnLend([id, timeString], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json({ message: 'success' });
	});
}

module.exports = {
	getAllBooks,
	addNewBook,
	getBook,
	lendHandler,
	checkLending,
	cancelLendHandler,
	getAllLending,
	approveHandler,
	returnHandler,
};
