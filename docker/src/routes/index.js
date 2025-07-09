const express = require('express');
const paymentRoutes = require('./paymentRoutes');
const planRoutes = require('./planRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/payment', paymentRoutes);
router.use('/plan', planRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
