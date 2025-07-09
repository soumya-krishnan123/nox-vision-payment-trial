const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const {
    validateUser,

} = require('../middleware/validator');

const router = express.Router();

router.post('/create',auth, subscriptionController.createSubscription);
router.post('/verify', auth, subscriptionController.verifySubscription);
router.post('/cancel', auth, subscriptionController.cancelSubscription);
router.get('/active-subscription-for-user', auth, subscriptionController.findActiveSubscriptionForUser);


module.exports = router;
