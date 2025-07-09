const express = require('express');
const router = express.Router();
const axios = require('axios');
const notificationModel = require('../models/notificationModel');
const subscriptionModel = require('../models/subscriptionModel');
const planModel = require('../models/planModel');
const { log } = require('winston');
const moment = require('moment');
exports.showNotification = async (user_id) => {
  try {
    const generatedNotifications = [];

    const activeSub = await subscriptionModel.findActiveSubscriptionForUser(user_id);
    if (!activeSub) return [];

    const planId = activeSub.plan_id;
    const planData = await planModel.getPlanByPlanId(planId);
    const currentUsage = await subscriptionModel.getModelAnalyticsForMonth(user_id);

    const detectionUsed = parseInt(currentUsage?.detections_this_month || 0);
    const detectionLimit = parseInt(planData?.detections || 0);

    if (detectionLimit > 0) {
      const usagePercent = Math.round((detectionUsed / detectionLimit) * 100);

      if (usagePercent >= 80) {
        generatedNotifications.push({
          title: 'Detection Quota Usage Alert',
          message: `You've used ${usagePercent}% of your detection quota (${detectionUsed} out of ${detectionLimit} detections).`,
          type: usagePercent >= 100 ? 'danger' : 'warning',
          is_read: false,
          status: 'generated',
          created_at: new Date(),
        });
      }
    }

    // ⏳ Check renewal
    const renewalDate = activeSub.next_billing_date;
    if (renewalDate) {
      const daysLeft = moment(renewalDate).diff(moment(), 'days');
      if (daysLeft <= 7) {
        generatedNotifications.push({
          title: 'Plan & BIlling Alert',
          message: `Your subscription will renew on ${moment(renewalDate).format('YYYY-MM-DD')}.`,
          type: 'info',
          is_read: false,
          status: 'generated',
          created_at: new Date(),
        });
      }
    }

    return generatedNotifications;
  } catch (error) {
    console.error('Error generating notifications:', error.message);
    throw new Error('Failed to generate notifications');
  }
};


