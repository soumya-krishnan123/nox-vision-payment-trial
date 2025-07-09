const invoiceService = require('../services/invoiceService');

exports.createInvoice = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const invoice = await invoiceService.createInvoice(req.body,user_id);
        res.status(200).json({
            status: true,
            status_code: 200,
            message: 'Invoice created successfully',
            data: invoice
          });    } catch (error) {
        next(error);
    }
}
exports.getInvoiceForUser = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const invoice = await invoiceService.getInvoiceForUser(user_id);
        res.status(200).json({
            status: true,
            status_code: 200,
            message: 'Invoice fetched successfully',
            data: invoice
          });    } catch (error) {
        next(error);
    }
}









