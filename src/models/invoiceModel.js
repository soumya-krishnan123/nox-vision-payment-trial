const db = require('../config/db');


exports.createInvoice = async (billing_data,user_id) => {
    const query = `
    INSERT INTO invoices (
      billing_name,
      billing_email,
      billing_address,
      user_id
      
    ) VALUES (
      $1, $2, $3, $4
    )
    RETURNING id, billing_name, billing_email, billing_address, created_at
  `;

  const values = [
    billing_data.billing_name,
    billing_data.billing_email,
    billing_data.billing_address,
    user_id
    
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}


exports.updateInvoice = async (id,billing_data,user_id) => {
    const query = `
    UPDATE invoices
    SET billing_name = $1, billing_email = $2, billing_address = $3
    WHERE id = $4 AND user_id = $5
    RETURNING id, billing_name, billing_email, billing_address, created_at
  `;

  const values = [billing_data.billing_name, billing_data.billing_email, billing_data.billing_address, id, user_id];

  const { rows } = await db.query(query, values);
  return rows[0];
}


exports.getInvoiceForUser = async (user_id) => {
    const query = `
    SELECT * FROM invoices WHERE user_id = $1
    `;

  const values = [user_id];

  const { rows } = await db.query(query, values);
  return rows[0];
}
    