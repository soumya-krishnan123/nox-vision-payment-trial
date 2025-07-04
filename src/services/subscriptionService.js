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

exports.updateSubscription = async (subscription_id,user_id) => {

    if (!subscription_id) {
      return res.status(400).json({ error: 'subscription_id is required' });
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
    console.log("sub", sub);
     
      const subscription=await subscriptionModel.createSubscription(sub,user_id);
      const payment=await paymentModel.create(sub,user_id,subscription.id);
      console.log("payment", payment);
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error.response?.data || error.message);
      return { error: 'Failed to update subscription' };
    }
    
  
};
