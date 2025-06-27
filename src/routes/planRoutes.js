const express = require('express');
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');
const { 
    validateUser,
    
} = require('../middleware/validator');

const router = express.Router();

router.post('/add', planController.addPlan);
router.get('/get/:id', planController.getPlanById);
router.put('/update/:id', planController.updatePlan);
router.delete('/delete/:id', planController.deletePlan);
router.get('/get-all', planController.getAllPlans);

module.exports = router;
