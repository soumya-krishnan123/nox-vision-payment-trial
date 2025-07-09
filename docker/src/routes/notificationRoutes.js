const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const { 
    validateUser,
    
} = require('../middleware/validator');
const router = express.Router();
router.get('/showNotification', auth, notificationController.showNotification);


module.exports = router;


