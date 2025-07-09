const notificationService = require('../services/notificationService');

exports.showNotification = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const notification = await notificationService.showNotification(user_id);
        res.status(200).json({
            status: true,
            status_code: 200,
            message: 'notification retrieved successfully',
            data: notification
          });  
          } catch (error) {
        next(error);
    }
}