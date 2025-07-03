const express = require('express');
const paymentRoutes = require('./paymentRoutes');
const planRoutes = require('./planRoutes');
const router = express.Router();

router.use('/payment', paymentRoutes);
router.use('/plan', planRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
