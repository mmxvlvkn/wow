const Router = require('express');
const productRouter = new Router();
const productController = require('../controllers/product_controller');

productRouter.post('/save_order', productController.saveOrder);
productRouter.post('/get_price_formation', productController.getPriceFormation);
productRouter.post('/create_product', productController.createProduct);
productRouter.get('/get_user_products', productController.getUserProducts);
productRouter.get('/get_all_products', productController.getAllProducts);
productRouter.post('/create_other_product', productController.createOtherProduct);
productRouter.get('/get_user_other_products', productController.getUserOtherProducts);
productRouter.get('/get_all_other_products', productController.getAllOtherProducts);

module.exports = productRouter;