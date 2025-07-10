const db = require('../config/db');

exports.createSubscription = async (sub, user_id) => {

    const plan_id = sub.plan_id;
    const subscription_status = sub.status.toLowerCase(); // ACTIVE, APPROVAL_PENDING, etc.
    const start_date = new Date(sub.start_time);
    const next_billing_date = sub.billing_info?.next_billing_time ? new Date(sub.billing_info.next_billing_time) : null;
    const last_payment_date = sub.billing_info?.last_payment?.time ? new Date(sub.billing_info.last_payment.time) : null;
    const insertQuery = `
      INSERT INTO subscriptions (
         user_id, plan_id, paypal_subscription_id, subscription_status,
        start_date, next_billing_date, last_payment_date
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7
      )
        
      RETURNING *
    `;

    const values = [
        user_id,
        plan_id,
        sub.id,
        subscription_status,
        start_date,
        next_billing_date,
        last_payment_date
    ];

    const { rows } = await db.query(insertQuery, values);
    console.log("subscription data",rows[0]);

    return rows[0];
    
}

  exports.cancelSubscription = async (paypal_subscription_id) => {
    const updateQuery = `
      UPDATE subscriptions
      SET subscription_status = 'cancelled'
      WHERE paypal_subscription_id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(updateQuery, [paypal_subscription_id]);
    return rows[0];
};
  exports.cancelSubscriptionById = async (id) => {
    const updateQuery = `
      UPDATE subscriptions
      SET subscription_status = 'cancelled'
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(updateQuery, [id]);
    return rows[0];
};



//findByPaypalSubscriptionId

exports.findByPaypalSubscriptionId = async (paypal_subscription_id) => {
  const query = `
    SELECT * from subscriptions
    WHERE paypal_subscription_id = $1;
  `;
  const { rows } = await db.query(query, [paypal_subscription_id]);
  console.log(rows[0]);
  return rows[0];
};

exports.findActiveSubscriptionForUser= async (user_id) => {
  const query = `
    SELECT * from subscriptions
    WHERE user_id = $1 AND subscription_status='active';
  `;
  const { rows } = await db.query(query, [user_id]);
  console.log(rows[0]);
  return rows[0];
};



exports.getModelAnalyticsForMonth = async (userId) => {
  const query = `
SELECT 
  COUNT(*) AS total_models,
  SUM(detection) AS total_detections,

  SUM(CASE 
        WHEN model_date >= date_trunc('month', CURRENT_DATE)
         AND model_date < date_trunc('month', CURRENT_DATE) + interval '1 month'
        THEN detection
        ELSE 0
      END) AS detections_this_month,
      COUNT(CASE 
          WHEN model_date >= date_trunc('month', CURRENT_DATE)
           AND model_date < date_trunc('month', CURRENT_DATE) + interval '1 month'
          THEN 1
        END) AS uploads_this_month
FROM models
WHERE user_id = $1;

  `;

  const { rows } = await db.query(query, [userId]);
  return rows[0];
};