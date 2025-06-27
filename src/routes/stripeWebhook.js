const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe'); // your Stripe instance
const bodyParser = require('body-parser');
const paymentModel = require('../models/paymentModel');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ✅ Apply bodyParser.raw ONLY here for webhook verification
router.post(
  '/stripe',
  bodyParser.raw({ type: 'application/json' }), // THIS IS CRITICAL
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    console.log(sig);
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook verified:', event.type);
    } catch (err) {
      console.error('Webhook verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Stripe Event Received:', event.type);

    // Example event handling
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      console.log(' PaymentIntent succeeded:', intent.id);

      try {
        await paymentModel.markAsSucceeded(intent.id, {
          receipt_url: intent.charges.data[0]?.receipt_url || null,
        });
      } catch (err) {
        console.error('Failed to update DB:', err.message);
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
