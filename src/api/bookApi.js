const bookCtrl = require('../controller/bookCtrl.js');

function bookApi (app) {
	app.get('/api/books', bookCtrl.getAllBooks);
	app.post('/api/add-new/book', bookCtrl.addNewBook);
	app.get('/api/book', bookCtrl.getBook);
	app.post('/api/lend', bookCtrl.lendHandler);
	app.post('/api/cancel/lend', bookCtrl.cancelLendHandler);
	app.get('/api/check/lending', bookCtrl.checkLending);
	app.get('/api/lends', bookCtrl.getAllLending);
	app.post('/api/lend/approve', bookCtrl.approveHandler);
	app.post('/api/lend/return', bookCtrl.returnHandler);
}

module.exports = bookApi;
