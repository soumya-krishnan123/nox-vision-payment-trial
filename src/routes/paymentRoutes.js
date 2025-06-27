const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { 
    validateUser,
    
} = require('../middleware/validator');

const router = express.Router();
router.post('/create-payment', paymentController.payment);

module.exports = router;
