const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { 
    validateUser,
    
} = require('../middleware/validator');

const router = express.Router();
router.post('/create-payment', paymentController.payment);
router.post('/purchase-history',auth,paymentController.showPurchaseHistory)
router.get('/get-invoice/:payment_id',auth,paymentController.showInvoice)
module.exports = router;
