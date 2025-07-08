const db = require('../config/db');

exports.create = async (sub,user_id,sub_id) => {


  const subscription_id = sub_id // PayPal subscription ID
  const plan_id=sub.plan_id
  const paypal_payment_id = sub.billing_info?.last_payment?.transaction_id || null;
  const amount = sub.billing_info?.last_payment?.amount?.value || 0;
  const currency = sub.billing_info?.last_payment?.amount?.currency_code || 'USD';
  const payment_status = (sub.status ).toLowerCase()|| 'pending'; 
  const payment_date = sub.billing_info?.last_payment?.time
    ? new Date(sub.billing_info.last_payment.time)
    : new Date();
  const payer_email = sub.subscriber?.email_address || null;
  const payment_method = 'paypal'; // You can make this dynamic if needed
  const status = true;
  const paypal_subscription_id = sub.id;
  const query = `
    INSERT INTO payments (
      subscription_id,
      user_id,
      paypal_payment_id,
      amount,
      currency,
      payment_status,
      payment_date,
      payer_email,
      payment_method,
      status,
      paypal_subscription_id,
      plan_id
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11,$12
    )
    RETURNING *
  `;

  const values = [
    subscription_id,
    user_id,
    paypal_payment_id,
    amount,
    currency,
    payment_status,
    payment_date,
    payer_email,
    payment_method,
    status,
    paypal_subscription_id,
    plan_id
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};


exports.findByUserId=async (user_id) => {
  const updateQuery = `
   SELECT p.id,p.amount,p.payment_method,p.created_at, sp.name AS plan_name
    FROM payments p
    LEFT JOIN subscription_plans sp ON p.plan_id = sp.plan_id
    WHERE p.user_id = $1 AND p.payment_status = 'active';
  `;
  const { rows } = await db.query(updateQuery, [user_id]);
  console.log(" i am here",rows);
  
  return rows;
};
exports.findPaymentDetailsForInvoice=async (payment_id) => {
  const updateQuery = `
 SELECT 
  p.amount,
  p.payment_method,
  p.created_at,
  p.payer_email,
  p.currency,
  sp.name AS plan_name,
  u.name AS user_name,    
  u.email AS user_email
FROM payments p
LEFT JOIN subscription_plans sp ON p.plan_id = sp.plan_id
LEFT JOIN users u ON p.user_id = u.id
WHERE p.id = $1;
  `;
  const { rows } = await db.query(updateQuery, [payment_id]);
  
  return rows[0];
};



exports.findByPaypalPaymenId=async (paypal_payment_id) => {
  const updateQuery = `
    SELECT * from payments
    WHERE paypal_payment_id = $1 AND payment_status='ACTIVE';
  `;
  const { rows } = await db.query(updateQuery, [paypal_payment_id]);
  console.log(rows);
  
  return rows;
};







// exports.markAsSucceeded = async (payment_intent_id, { receipt_url }) => {
//   console.log(payment_intent_id, receipt_url);
//   const query = `
//     UPDATE payments
//     SET payment_status = 'succeeded',
//         receipt_url = $1,
//         updated_at = NOW()
//     WHERE stripe_payment_intent_id = $2
//   `;
//   await db.query(query, [receipt_url, payment_intent_id]);
// };

