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

// exports.createPayment = async ({ user_id, plan_id, amount, currency = 'usd' }) => {
//     // 1. Create a Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency,
//       payment_method_types: ['card'],
//       metadata: {
//         user_id,
//         plan_id,
//       },
//     });
  
//     // 2. Save to your DB
//     const payment = await paymentModel.create({
//       user_id,
//       plan_id,
//       stripe_payment_intent_id: paymentIntent.id,
//       stripe_invoice_id: null, // for subscriptions
//       stripe_customer_id: paymentIntent.customer || null,
//       amount,
//       payment_status: paymentIntent.status, // should be 'requires_payment_method'
//       payment_method: 'card',
//       receipt_url: null, // updated later via webhook
//       status: true,
//     });
  
//     // 3. Return both DB data and client_secret
//     return {
//       ...payment,
//       client_secret: paymentIntent.client_secret,
//     };
//   };
  



// exports.createPayment = async (paymentData) => {
//   // Check if user already exists
//   console.log(paymentData);

//   // Create payment
//   const payment = await paymentModel.create({
//     ...paymentData,
//     status: true,
   
//   });


//   return payment;
// };

// exports.loginUser = async (email, password) => {
//   // Find user
//   const user = await userModel.findByEmail(email);
//   if (!user) {
//     const error = new Error('User not found');
//     error.statusCode = 401;
//     throw error;
//   }

//   // Check if email is verified (only for non-Google users)
//   if (!user.google_id && !user.is_email_verified) {
//     const error = new Error('Please verify your email address before logging in');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Check password (only for non-Google users)
//   if (!user.google_id) {
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       const error = new Error('Password is incorrect');
//       error.statusCode = 401;
//       throw error;
//     }
//   } else {
//     // Google user trying to login with password
//     const error = new Error('Please use Google Sign-In for this account');
//     error.statusCode = 401;
//     throw error;
//   }

//   // Generate token
//   const token = jwt.sign(
//     { id: user.id, email: user.email },
//     config.JWT_SECRET,
//     { expiresIn: config.JWT_EXPIRES_IN }
//   );

//   // Remove password from response
//   delete user.password;

//   return { user, token };
// };


// exports.verifyOtp = async (email, otpCode) => {
//   const user = await userModel.findByEmail(email);
//   if (!user) {
//     const error = new Error('User not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   const otpRecord = await userModel.findLatestOtp(user.id, otpCode);

//   if (!otpRecord) {
//     const error = new Error('Invalid OTP');
//     error.statusCode = 400;
//     throw error;
//   }

//   if (otpRecord.used) {
//     const error = new Error('OTP has already been used');
//     error.statusCode = 400;
//     throw error;
//   }

//   if (new Date() > otpRecord.expires_at) {
//     const error = new Error('OTP has expired');
//     error.statusCode = 400;
//     throw error;
//   }

//   await userModel.markOtpAsUsed(otpRecord.id);
//   const token = jwt.sign(
//     { id: user.id, email: user.email },
//     config.JWT_SECRET,
//     { expiresIn: config.JWT_EXPIRES_IN || '1h' }
//   );


//   return {
//     user,
//     token
//   };
// };


