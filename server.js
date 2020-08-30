const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// STRIPE_SECRET_KEy is accessible after this line
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post('/payment', (req, res) => {
	const body = {
		source: req.body.token.id,
		amount: req.body.amount,
		currency: 'usd',
		description: 'This is a test payment from CRWN',
	};

	stripe.charges.create(body, (stripeErr, stripeRes) => {
		if (stripeErr) {
			console.log(stripeErr);
			res.status(500).send({ error: stripeErr });
		} else {
			res.status(200).send({ success: stripeRes });
		}
	});
});

app.get('/', (req, res) => {
	res.status(200).json({ status: 'OK', message: 'Server is up' });
});

app.listen(port, (err) => {
	if (err) throw err;
	console.log('Server running on port ' + port);
});
