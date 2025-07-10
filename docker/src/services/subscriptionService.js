const express = require('express');
const router = express.Router();
const axios = require('axios');
const subscriptionModel = require('../models/subscriptionModel');
const paymentModel = require('../models/paymentModel');
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}


exports.createSubscription = async (plan_id) => {
  try {
    console.log("plan_id", plan_id);
    if (!plan_id) {
      return res.status(400).json({ error: 'plan_id is required' });
    }

    const accessToken = await getAccessToken();
    console.log("accessToken", accessToken);
    // Create subscription payload
    const payload = {
      plan_id,
      application_context: {
        brand_name: "Nox Vision",
        user_action: "SUBSCRIBE_NOW",
        return_url: "https://yourfrontend.com/subscription-success",
        cancel_url: "https://yourfrontend.com/subscription-cancel",
      }
    };
    console.log('Payload being sent to PayPal:', JSON.stringify(payload, null, 2));

    const response = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    // Extract approval URL to redirect user
    const approvalLink = response.data.links.find(link => link.rel === 'approve');

    return ({
      subscriptionId: response.data.id,
      approvalUrl: approvalLink.href
    });

  } catch (error) {
    console.error('Error creating subscription:', error.response?.data || error.message);
    return { error: 'Failed to create subscription' };
  }
};

exports.updateSubscription = async (subscription_id, user_id) => {

  if (!subscription_id) {
    throw new Error('subscription_id is required');

  }
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const sub = response.data;
console.log('subscription data from paypal', JSON.stringify(sub, null, 2)); // pretty log

// ✅ Extract country code if available
const countryCode = sub?.subscriber?.shipping_address?.address?.country_code;

if (countryCode) {
  console.log('Subscriber country code:', countryCode);
} else {
  console.log('Country code not available in shipping_address');
}   
//     const existing_subscription=subscriptionModel.findByPaypalSubscriptionId(sub.id)
// if(existing_subscription){
//   throw new Error('Suscription id from paypal already exists');
// }
// const existing_payment=paymentModel.findByPaypalPaymenId(sub.billing_info?.last_payment?.transaction_id)
// if(existing_payment){
//   throw new Error('Payment already exists for this PayPal payment ID');

// }
    const previousSubscription = await subscriptionModel.findActiveSubscriptionForUser(user_id);
    if (previousSubscription) {
      // Cancel the previous subscription
      console.log("previousSubscription", previousSubscription);
      
      const id = previousSubscription.id;
      console.log("subscription_id", id);
      
    const cancelled = await subscriptionModel.cancelSubscriptionById(id);
      console.log("cancelled", cancelled);
    }
    const subscription = await subscriptionModel.createSubscription(sub, user_id);
    
    const payment = await paymentModel.create(sub, user_id, subscription.id);
    console.log("payment", payment);
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error.response?.data || error.message);
    throw error; 
  }


};

//cancel subscription
exports.cancelSubscription = async (subscription_id) => {
  try {
    const accessToken = await getAccessToken();
    // Cancel on PayPal
    await axios.post(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}/cancel`,
      { reason: 'User requested cancellation' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Update in DB
    const cancelled = await subscriptionModel.cancelSubscription(subscription_id);
    return cancelled;
  } catch (error) {
    console.error('Error cancelling subscription:', error.response?.data || error.message);
    throw new Error('Failed to cancel subscription');
  }
};


exports.findActiveSubscriptionForUser=async (user_id) => {
  try {
   
 
    const datas = await subscriptionModel.findActiveSubscriptionForUser(user_id);
    return datas;
  } catch (error) {
    console.error('Error cancelling subscription:', error.response?.data || error.message);
    throw new Error('Failed to cancel subscription');
  }
};