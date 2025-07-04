const subscriptionService = require('../services/subscriptionService');



exports.createSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionService.createSubscription(req.body.plan_id);
        if (!subscription) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'Failed to add plan'
            });
        }
        return res.status(200).json({
            status: true,
            status_code: 200,
            message: 'Subscription created successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

exports.verifySubscription = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { subscription_id } = req.body;
        if (!subscription_id || !user_id) {
            return res.status(400).json({ error: 'subscription_id and user_id are required' });
        }

        const result = await subscriptionService.updateSubscription(subscription_id, user_id);
        res.status(200).json({
            status: true,
            message: 'Subscription verified and stored successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error verifying subscription:', error.message);
        res.status(500).json({
            status: false,
            message: 'Subscription verification failed',
            error: error.message,
        });
    }
};
