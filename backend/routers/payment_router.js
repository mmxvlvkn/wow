const Router = require('express');
const paymentRouter = new Router();
const paymentController = require('../controllers/payment_controller');

paymentRouter.post('/get_order_description', paymentController.getOrderDescription);

module.exports = paymentRouter;