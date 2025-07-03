// createProduct.js
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

async function createProduct() {
  const accessToken = await getAccessToken();

  const productData = {
    name: 'Nox Vision Models',
    description: 'Uploading models to the platform',
    type: 'SERVICE',
    category: 'SOFTWARE',
  };

  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/catalogs/products',
    productData,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('✅ Product Created:', response.data);
}

createProduct().catch(console.error);
