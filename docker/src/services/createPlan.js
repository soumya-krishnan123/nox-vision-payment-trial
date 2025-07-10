// createPlan.js
require('dotenv').config();
const axios = require('axios');

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
const customPlanData = {
  product_id: 'PROD-6F6597158H6865522',
  name: 'Freemium Plan',
  description: '7-day free trial followed by $4.99/month subscription',
  billing_cycles: [
    {
      // Trial
      frequency: {
        interval_unit: 'DAY',
        interval_count: 7,
      },
      tenure_type: 'TRIAL',
      sequence: 1,
      total_cycles: 1,
      pricing_scheme: {
        fixed_price: {
          value: '0',
          currency_code: 'USD',
        },
      },
    },
    {
      // Paid monthly cycle
      frequency: {
        interval_unit: 'MONTH',
        interval_count: 1,
      },
      tenure_type: 'REGULAR',
      sequence: 2,
      total_cycles: 0,
      pricing_scheme: {
        fixed_price: {
          value: '4.99',
          currency_code: 'USD',
        },
      },
    },
  ],
  payment_preferences: {
    auto_bill_outstanding: true,
    setup_fee_failure_action: 'CONTINUE',
    payment_failure_threshold: 3,
  },
  taxes: {
    percentage: '0',
    inclusive: false,
  },
};

  
  

async function createPlan() {
  const accessToken = await getAccessToken();
try{
  
  
  

  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/billing/plans',
    customPlanData,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log(' Plan Created:', response.data);
}
catch(error){
  console.error(' Failed to create plan:', error.response.data);
}
}
createPlan().catch(console.error);
