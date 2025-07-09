const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');
const paymentModel = require('../models/paymentModel');
const logger = require('../utils/logger');


const axios = require('axios');

exports.getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, 
    'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
}

exports.createPayment = async (sub, user_id) => {
    
  console.log("sub", sub);

  
  };
  exports.showPurchaseHistory=async (userId) => {
    const purchases = await paymentModel.findByUserId(userId);
    if (!purchases) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }
  return purchases;
  };
  
  exports.showInvoiceforPaymentId=async (payment_id) => {
    const invoice = await paymentModel.findPaymentDetailsForInvoice(payment_id);
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
  return invoice;
  };