
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const planModel = require('../models/planModel');

const logger = require('../utils/logger');

//add plan
exports.addPlan = async (planData) => {
  // Check if user already exists
  console.log(planData);
  const existingPlan = await planModel.getPlanByName(planData.name);
  if (existingPlan) {
    const error = new Error('Plan with this name already exists');
    error.statusCode = 409;
    throw error;
  } 
  const existingPlanwithPlanId = await planModel.getPlanByPlanId(planData.plan_id);
  if (existingPlanwithPlanId) {
    const error = new Error('Plan with this Paypal plan id already exists');
    error.statusCode = 409;
    throw error;
  } 

  // Create plan
  const plan = await planModel.createPlan({
    ...planData
  });

  return plan;
};

//get plan by id
exports.getPlanById = async (planId) => {
  const plan = await planModel.findById(planId);
  if (!plan) {
    const error = new Error('Plan not found');
    error.statusCode = 404;
    throw error;
  }
return plan;
};

//update plan
exports.updatePlan = async (planId, planData) => {
  // Check if plan exists
  const existingPlan = await planModel.getPlanByName(planData.name);
  if (!existingPlan) {
    const error = new Error('Plan not found');
    error.statusCode = 404;
    throw error;
  }

  // Update plan
  const updatedPlan = await planModel.update(planId, planData);

  return updatedPlan;
};

//delete plan
exports.deletePlan = async (planId) => {
  const plan = await planModel.findById(planId);
  if (!plan) {
    const error = new Error('Plan not found');
    error.statusCode = 404;
    throw error;
  }
  await planModel.delete(planId);
  return true;
};

//get all plans
exports.getAllPlans = async () => {
  const plans = await planModel.getAllPlans();
  if (!plans) {
    const error = new Error('No plans found');
    error.statusCode = 404;
    throw error;
  }

  return plans;
};

