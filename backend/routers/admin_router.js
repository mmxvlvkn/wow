const Router = require('express');
const adminRouter = new Router();
const adminController = require('../controllers/admin_controller');

adminRouter.get('/is_admin', adminController.isAdmin);

module.exports = adminRouter;