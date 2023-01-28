const Router = require('express');
const authRouter = new Router();
const authController = require('../controllers/auth_controller');

authRouter.post('/send_email_code', authController.sendEmailCode);
authRouter.options('/send_email_code', authController.sendOptions);
authRouter.post('/sign_in', authController.singIn);
authRouter.options('/sign_in', authController.sendOptions);
authRouter.post('/send_code_again', authController.sendCodeAgain);
authRouter.options('/send_code_again', authController.sendOptions);
authRouter.get('/check_token', authController.checkToken);
authRouter.options('/check_token', authController.sendOptions);

module.exports = authRouter;