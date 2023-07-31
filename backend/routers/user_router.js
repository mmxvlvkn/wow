const Router = require('express');
const userRouter = new Router();
const userController = require('../controllers/user_controller');

userRouter.get('/get_user_info', userController.getUserInfo);
userRouter.post('/change_user_nickname', userController.changeUserNickname);
userRouter.post('/change_user_telegram', userController.changeUserTlg);

module.exports = userRouter;