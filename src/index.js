const express = require('express');
const router = require('./router');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
	cors({
		origin: process.env.CLIENT_BASE_URL,
		credentials: true,
	}),
);
app.use(bodyParser.urlencoded({ extended: true }));

const dir = path.join(__dirname, 'images');
app.use('/assets/images', express.static(dir));

router(app);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
