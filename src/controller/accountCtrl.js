const accountModel = require('../model/accountModel.js');
const jwt = require('jsonwebtoken');
const sha512 = require('crypto-js/sha512');

const JWT_SECRET = process.env.JWT_SECRET;

function hash (str) {
	return sha512(str).toString();
}

function isLogin (req, res, next) {
	const cookies = req.headers.cookie;
	const token = cookies ? cookies.split('; ')
	                               .find(cookie => cookie.startsWith('token='))
	                               ?.split('=')[1] : null;
	const url = req.originalUrl;

	if (url.includes('login') || url.includes('register')) {
		return next();
	}

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			const name = err.name;
			const message = err.message;

			if (name === 'JsonWebTokenError') {
				if (message === 'invalid signature') {
					return res.status(401).send({ message: 'Unauthorized' });
				}
			}

			return res.status(500).send({ message: 'Internal server error' });
		} else {
			next();
		}
	});
}

function getAccount (req, res) {
	accountModel.getAccountByID((err, result) => {
		if (err) {
			throw err;
		}

		console.log(result);
		res.status(200).json(result);
	});
}

function login (req, res) {
	const username = req.body.username;
	const password = req.body.password;

	accountModel.login(atob(username), (err, result) => {
		if (err) {
			throw err;
		}

		if (JSON.stringify(result) === '{}') {
			res.status(401).json({ message: 'Username does not exist' });
			return;
		}

		const resultPassword = result?.password;

		if (resultPassword !== hash(atob(password))) {
			res.status(401).json({ message: 'Wrong password' });
			return;
		}

		const data = JSON.stringify({
			id: result.id,
			name: result.name,
			phone: result.phone,
			role: result.role,
		});
		const token = jwt.sign({ data }, JWT_SECRET, {
			expiresIn: '4h',
			algorithm: 'HS256',
		});

		res.setHeader(
			'Set-Cookie',
			`token=${token}; Max-Age=14400; SameSite=strict; httpOnly`,
		);

		// res.cookie('token', token, {
		// 	maxAge: 60 * 60 * 1000 * 4,
		// 	httpOnly: true,
		// 	sameSite: 'strict',
		// });
		res.status(200).json({ message: 'Success' });
	});
}

function register (req, res) {
	const name = req.body.name;
	const username = req.body.username;
	const password = req.body.password;
	const passwordHashed = hash(atob(password));

	accountModel.register([name, atob(username), passwordHashed], (err, result) => {
		if (err) {
			throw err;
		}

		const data = JSON.stringify({
			id: result.insertedId,
			name,
			phone: atob(username),
			role: 'customer',
		});

		const token = jwt.sign({ data }, JWT_SECRET, {
			expiresIn: '4h',
			algorithm: 'HS256',
		});

		res.setHeader(
			'Set-Cookie',
			`token=${token}; Max-Age=14400; SameSite=strict; httpOnly`,
		);

		res.status(200).json({ message: 'Success' });
	});
}

function getUserInfoByCookie (req, res) {
	const cookies = req.headers.cookie;
	const token = cookies ? cookies.split('; ')
	                               .find(cookie => cookie.startsWith('token='))
	                               ?.split('=')[1] : null;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded) {
			res.status(200).json(JSON.parse(decoded.data));
		}
	});
}

function logout (req, res) {
	res.setHeader('Set-Cookie', `token=; Max-Age=; SameSite=; httpOnly`);

	res.status(200).json({ message: 'Success' });
}

module.exports = {
	isLogin,
	getAccount,
	login,
	register,
	getUserInfoByCookie,
	logout,
};
