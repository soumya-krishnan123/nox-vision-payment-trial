// utils/paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
