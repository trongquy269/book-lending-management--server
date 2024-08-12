const express = require('express');
const router = require('./router');
require('dotenv').config();
const path = require('path');

const app = express();

const dir = path.join(__dirname, 'images');
app.use('/assets/images', express.static(dir));

router(app);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
