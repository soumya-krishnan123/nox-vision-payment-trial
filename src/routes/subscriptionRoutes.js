const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const {
    validateUser,

} = require('../middleware/validator');

const router = express.Router();

router.post('/create',auth, subscriptionController.createSubscription);
router.post('/verify', auth, subscriptionController.verifySubscription);

module.exports = router;
