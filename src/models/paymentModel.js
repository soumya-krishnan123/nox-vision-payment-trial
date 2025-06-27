const db = require('../config/db');

exports.create = async (paymentData) => {
  const { user_id,
    plan_id,
    stripe_payment_intent_id,
    stripe_invoice_id,
    stripe_customer_id,
    amount ,
    payment_status,
    payment_method,
    receipt_url
  } = paymentData;
  
  const query = `
    INSERT INTO payments (user_id, plan_id, stripe_payment_intent_id, stripe_invoice_id, stripe_customer_id, amount, payment_status, payment_method, receipt_url)
    VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)
    RETURNING id, user_id, plan_id, stripe_payment_intent_id, stripe_invoice_id, stripe_customer_id, amount, payment_status, payment_method, receipt_url
  `;
  
  const { rows } = await db.query(query, [user_id, plan_id, stripe_payment_intent_id, stripe_invoice_id, stripe_customer_id, amount, payment_status, payment_method, receipt_url]);
  return rows[0];
};



exports.findByEmail = async (email) => {
  const query = `
    SELECT id, name, email, google_id,is_email_verified,password
    FROM users
    WHERE email = $1
  `;
  
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

exports.findByGoogleId = async (google_id) => {
    const query = `
      SELECT id, name, email, created_at, google_id, email_alerts, is_email_verified
      FROM users
      WHERE google_id = $1
    `;
    
    const { rows } = await db.query(query, [google_id]);
    return rows[0];
  };

exports.findById = async (id) => {
  const query = `
    SELECT id, name, email, created_at, google_id, email_alerts, is_email_verified,password
    FROM users
    WHERE id = $1
  `;
  
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

exports.update = async (id, userData) => {
  const allowedFields = ['name','email_alerts','is_email_verified'];
  const updates = [];
  const values = [];
  
  // Build dynamic query based on provided fields
  let i = 1;
  for (const [key, value] of Object.entries(userData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
  }
  
  if (updates.length === 0) {
    return this.findById(id);
  }
  
  values.push(id);
  
  const query = `
    UPDATE users
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE id = $${i}
    RETURNING id, name, email, created_at, updated_at, google_id, email_alerts, is_email_verified
  `;
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.saveResetToken = async (userId, token, expiry) => {
  const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expiry = to_timestamp($2 / 1000.0)
    WHERE id = $3
    RETURNING id
  `;
  
  const { rows } = await db.query(query, [token, expiry, userId]);
  return rows[0];
};

exports.findByResetToken = async (token) => {
  const query = `
    SELECT id, reset_token_expiry
    FROM users
    WHERE reset_token = $1
  `;
  
  const { rows } = await db.query(query, [token]);
  return rows[0];
};

exports.markAsSucceeded = async (payment_intent_id, { receipt_url }) => {
  console.log(payment_intent_id, receipt_url);
  const query = `
    UPDATE payments
    SET payment_status = 'succeeded',
        receipt_url = $1,
        updated_at = NOW()
    WHERE stripe_payment_intent_id = $2
  `;
  await db.query(query, [receipt_url, payment_intent_id]);
};

