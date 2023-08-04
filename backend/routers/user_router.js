const Router = require('express');
const userRouter = new Router();
const userController = require('../controllers/user_controller');

userRouter.get('/get_user_info', userController.getUserInfo);
userRouter.post('/change_user_nickname', userController.changeUserNickname);
userRouter.post('/change_user_telegram', userController.changeUserTlg);
userRouter.post('/send_code_for_change_email', userController.sendCodeForChangeEmail);
userRouter.post('/change_user_email', userController.changeUserEmail);
userRouter.post('/send_code_for_set_pass', userController.sendCodeForSetPass);
userRouter.post('/set_user_password', userController.changeUserPassword);

module.exports = userRouter;