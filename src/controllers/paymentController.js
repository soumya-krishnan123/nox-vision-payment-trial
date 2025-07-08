const paymentService = require('../services/paymentServices');


exports.payment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Payment successful',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
exports.showPurchaseHistory= async (req, res, next) => {
  try {
     const user_id=req.user.id
      const result = await paymentService.showPurchaseHistory(user_id);
      res.status(200).json({
          status: true,
          status_code: 200,
          message: 'Purchase history retrieved successfully',
          data: result,
      });
  } catch (error) {
      console.error('Error retieving Purchase history:', error);
    next(error)
  }
};



exports.showInvoice= async (req, res, next) => {
  try {
     const user_id=req.user.id
     const payment_id=req.params.payment_id
      const result = await paymentService.showInvoiceforPaymentId(payment_id);
      res.status(200).json({
          status: true,
          status_code: 200,
          message: 'Invoice retrieved successfully',
          data: result,
      });
  } catch (error) {
      console.error('Error retieving Invoice:', error);
     next(error)
  }
};