const Router = require('express');
const userRouter = new Router();
const userController = require('../controllers/user_controller');

userRouter.get('/get_user_info', userController.getUserInfo);

module.exports = userRouter;