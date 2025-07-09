const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { 
    validateUser,
    
} = require('../middleware/validator');
const invoiceController = require('../controllers/invoiceController');
const router = express.Router();
router.post('/create', auth, invoiceController.createInvoice);
router.get('/get', auth, invoiceController.getInvoiceForUser);

module.exports = router;


