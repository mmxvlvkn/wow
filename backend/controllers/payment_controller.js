const database = require('../database/database.js');
const ress = require('../services/response_service.js');

class paymentController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async getOrderDescription(req, res) {
        try {
            let orderNumber = req.body.orderNumber;
            let data;
            try {
                data = await database.query('SELECT title_en, title_ru, order_description, price, current_language FROM orders WHERE order_number = $1', [orderNumber]);
            } catch (error) {
                console.log('Error: ' + error);
                return ress.create(res, 500, {en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
            }
            data = data.rows[0];
            return ress.create(res, 200, data);
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new paymentController();