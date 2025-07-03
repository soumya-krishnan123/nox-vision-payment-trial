
const db = require('../config/db');
exports.createPlan = async (plan) => {
  const query = `
    INSERT INTO subscription_plans (
      name,
      plan_id,
      amount,
      currency,
      uploads,
      detections,
      api_calls,
      sdk_access,
      email_support,
      model_hosting,
      offline_detection,
      analytics,
      billing_period
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11, $12,
      $13
    )
    RETURNING id, name, created_at
  `;

  const values = [
    plan.name,
    plan.plan_id,
    plan.amount,
    plan.currency,
    plan.uploads,
    plan.detections,
    plan.api_calls,
    plan.sdk_access,
    plan.email_support,
    plan.model_hosting,
    plan.offline_detection,
    plan.analytics,
    plan.billing_period
    
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.findById = async (planId) => {
  const query = `
      SELECT id, name, model_hosting, offline_detection, analytics, billing_period, status
      FROM subscription_plans
      WHERE id = $1
      LIMIT 1
    `;
  const { rows } = await db.query(query, [planId]);
  return rows[0];
};


//show all plans
exports.getAllPlans = async () => {
  const query = `
    SELECT id, name, model_hosting, offline_detection, analytics,status,amount,detections,uploads,api_calls,sdk_access,email_support,stripe_price_id,currency,billing_period
    FROM subscription_plans 
    WHERE status = true
  `;
  const { rows } = await db.query(query);
  return rows;
};

exports.getPlanByName = async (planName) => {
  const query = `
      SELECT id, name, model_hosting, offline_detection, analytics, billing_period, status
      FROM subscription_plans
      WHERE name = $1
      LIMIT 1
    `;
  const { rows } = await db.query(query, [planName]);
  return rows[0];
};