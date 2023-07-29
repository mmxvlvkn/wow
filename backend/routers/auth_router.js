const Router = require('express');
const authRouter = new Router();
const authController = require('../controllers/auth_controller');

authRouter.options('*', authController.sendOptions);

authRouter.post('/send_email_code', authController.sendEmailCode);
authRouter.post('/sign_in', authController.singIn);
authRouter.post('/send_code_again', authController.sendCodeAgain);
authRouter.post('/log_in', authController.logIn);
authRouter.get('/check_token', authController.checkToken);
authRouter.post('/send_refresh_email_code', authController.sendRefreshEmailCode);
authRouter.post('/check_access_code_on_server', authController.checkAccessCodeOnServer);
authRouter.post('/change_user_password', authController.changeUserPassword);

module.exports = authRouter;