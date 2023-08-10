const database = require('../database/database.js');
const tokenService = require('../services/token_service.js');
const jwt = require('jsonwebtoken');
const ress = require('../services/response_service.js');
require('dotenv').config();
const secret = process.env.secret;

class productController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async saveOrder(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                try {
                    let title = req.body.title;
                    const sendingData = req.body.data;
                    let dataForPriceFormation = await database.query('SELECT price_data FROM price_formation WHERE price_name = $1', [title]);
                    dataForPriceFormation = JSON.parse(dataForPriceFormation.rows[0].price_data);

                    //Price and description formation
                    let orderDescription = 'radio:\n';
                    let price = dataForPriceFormation.base_price;
                    let coef = 1;

                    for (let key in dataForPriceFormation.radio) {
                        orderDescription += '    ' + key + ':\n';
                        orderDescription += '        ' + sendingData.radio[key] + ',\n';
                        const optionsObject = dataForPriceFormation.radio[key][sendingData.radio[key]];
                        if (optionsObject.is_coef) {
                            coef *= optionsObject.value;
                        } else {
                            price += optionsObject.value;
                        }
                    }
                    orderDescription += 'range:\n';
                    for (let key in dataForPriceFormation.range) {
                        orderDescription += '    ' + key + ':\n';
                        orderDescription += '        ' + sendingData.range[key] + ',\n';
                        const optionsObject = dataForPriceFormation.range[key];
                        if (optionsObject.is_coef) {
                            coef *= sendingData.range[key] * optionsObject.value;
                        } else {
                            price += sendingData.range[key] * optionsObject.value;
                        }
                    }
                    orderDescription += 'checkbox:\n';
                    for (let key in dataForPriceFormation.checkbox) {
                        orderDescription += '    ' + key + ':\n';
                        for (let item of sendingData.checkbox[key]) {
                            orderDescription += '        ' + item + ',\n';
                            const optionsObject = dataForPriceFormation.checkbox[key][item];
                            if (optionsObject.is_coef) {
                                coef *= optionsObject.value;
                            } else {
                                price += optionsObject.value;
                            }
                        }
                    }
                    orderDescription += 'select:\n';
                    for (let key in dataForPriceFormation.select) {
                        orderDescription += '    ' + key + ':\n';
                        orderDescription += '        ' + sendingData.select[key] + ',\n';
                        const optionsObject = dataForPriceFormation.select[key][sendingData.select[key]];
                        if (optionsObject.is_coef) {
                            coef *= optionsObject.value;
                        } else {
                            price += optionsObject.value;
                        }
                    }
                    price *= coef;
                    price = price.toFixed(2);

                    let userData = await database.query('SELECT * FROM person WHERE email = $1', [tokenInfo.dbData.email]);
                    userData = userData.rows[0];

                    // Formation title
                    title = title.replace(/_/g, ' ');
                    title = title[0].toUpperCase() + title.slice(1);

                    //get current order number
                    let orderNumder = await database.query('SELECT * FROM current_order_number');
                    orderNumder = Number(orderNumder.rows[0].order_number) + 1;

                    let count = 1;
                    let tempOrderNumber = orderNumder;
                    let newOrderNumber = '';
                    while (tempOrderNumber > 9) {
                        tempOrderNumber = Math.floor(tempOrderNumber / 10);
                        count++;
                    }
                    for (let i = 0; i < 6 - count; i++) {
                        newOrderNumber += '0';                       
                    }
                    newOrderNumber += orderNumder;
                    
                    try {
                        await database.query('INSERT INTO orders (order_number, user_id, title, order_description, price, current_language) values ($1, $2, $3, $4, $5, $6)', [newOrderNumber, tokenInfo.dbData.id, title, orderDescription, price, req.body.currentLanguage]);
                        await database.query('UPDATE current_order_number SET order_number = $2 WHERE order_number = $1', [orderNumder - 1, orderNumder]);

                        setTimeout(async () => {
                            await database.query('DELETE FROM orders WHERE order_number = $1', [newOrderNumber]);
                        }, 1000 * 60 * 10);
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                    }

                    return ress.create(res, 200, newOrderNumber);
                } catch (error) {
                    console.log('Error: ' + error)
                    return ress.create(res, 409, 'Ordering error');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getPriceFormation(req, res) {
        try {
            try {
                const title = req.body.title;
                let dataForPriceFormationTitles = await database.query('SELECT price_name FROM price_formation');
                dataForPriceFormationTitles = dataForPriceFormationTitles.rows;

                let titleIsValid = false;
                dataForPriceFormationTitles.forEach(data => {
                    if (data.price_name == title) {
                        titleIsValid = true;
                    }
                });

                if (titleIsValid) {
                    let dataForPriceFormation = await database.query('SELECT price_data FROM price_formation WHERE price_name = $1', [title]);
                    dataForPriceFormation = JSON.parse(dataForPriceFormation.rows[0].price_data);

                    return ress.create(res, 200, dataForPriceFormation);
                } else {
                    console.log('Error: ' + error);
                    return ress.create(res, 400, {en: 'Bad Request', ru: 'Неккоректные данные'});
                }

            } catch (error) {
                console.log('Error: ' + error);
                return ress.create(res, 500, {en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async createProduct(req, res) {
        try {
            if (req.body.status === 'OK') {
                let order;
                try {
                    order = await database.query('SELECT * FROM orders WHERE order_number = $1', [req.body.orderNumber]);
                } catch (error) {
                    console.log('Error: ' + error);
                    return ress.create(res, 500, {en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
                }

                order = order.rows[0];
                const date = new Date;
                const currentDate = `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}.${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${(date.getFullYear() % 100 < 10) ? '0' + (date.getFullYear() % 100) : date.getFullYear() % 100}`;
                const currentTime = `${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}`;

                try {
                    if ((await database.query('SELECT * FROM products WHERE order_number = $1', [order.order_number])).rows.length === 0) {
                        await database.query('INSERT INTO products (order_number, user_id, title, order_description, price, create_date, create_time, product_status, current_language) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [order.order_number, order.user_id, order.title, order.order_description, order.price, currentDate, currentTime, 1, order.current_language]);
                    } else {
                        return ress.create(res, 400, {en: 'This product already exist', ru: 'Данный продукт уже оформлен'});
                    }

                } catch (error) {
                    console.log('Error: ' + error);
                    return ress.create(res, 500, {en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
                }

                return ress.create(res, 200, {status: 'OK'});
            } else {
                console.log('Error: ' + error);
                return ress.create(res, 400, {en: 'Bad Request', ru: 'Неккоректные данные'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async getUserProducts(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                try {  
                    let sendData;
                    try {
                        sendData = (await database.query('SELECT * FROM products WHERE user_id = $1', [tokenInfo.dbData.id])).rows;
                        console.log(sendData)

                        for (let i = 0; i < sendData.length; i++) {
                            const userData = (await database.query('SELECT * FROM person WHERE id = $1', [sendData[i].user_id])).rows[0];
                            sendData[i].email = userData.email;
                            sendData[i].nickname = userData.nickname;
                            sendData[i].tlg = userData.tlg;
                            if (sendData[i].product_status === 0) {
                                sendData[i].product_status = '<span class="en">Canceled,</span><span class="ru">Отменен,</span>';
                            } else if (sendData[i].product_status === 1) {
                                sendData[i].product_status = '<span class="en">Paid,</span><span class="ru">Оплачен,</span>';
                            } else if (sendData[i].product_status === 2) {
                                sendData[i].product_status = '<span class="en">Performed,</span><span class="ru">Выполняется,</span>';
                            } else if (sendData[i].product_status === 3) {
                                sendData[i].product_status = '<span class="en">Completed,</span><span class="ru">Выполнен,</span>';
                            }
                        }
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                    }

                    
                    return ress.create(res, 200, sendData);
                } catch (error) {
                    console.log('Error: ' + error)
                    return ress.create(res, 409, 'Geting products error');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getAllProducts(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                if (tokenInfo.dbData.roole === 'admin') {
                    try {  
                        let sendData;
                        try {
                            sendData = (await database.query('SELECT * FROM products')).rows;

                            for (let i = 0; i < sendData.length; i++) {
                                const userData = (await database.query('SELECT * FROM person WHERE id = $1', [sendData[i].user_id])).rows[0];
                                sendData[i].email = userData.email;
                                sendData[i].nickname = userData.nickname;
                                sendData[i].tlg = userData.tlg;
                                if (sendData[i].product_status === 0) {
                                    sendData[i].product_status = '<span class="en">Canceled,</span><span class="ru">Отменен,</span>';
                                } else if (sendData[i].product_status === 1) {
                                    sendData[i].product_status = '<span class="en">Paid,</span><span class="ru">Оплачен,</span>';
                                } else if (sendData[i].product_status === 2) {
                                    sendData[i].product_status = '<span class="en">Performed,</span><span class="ru">Выполняется,</span>';
                                } else if (sendData[i].product_status === 3) {
                                    sendData[i].product_status = '<span class="en">Completed,</span><span class="ru">Выполнен,</span>';
                                }
                            }
                        } catch (error) {
                            console.log('Error: ' + error)
                            return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        return ress.create(res, 200, sendData);
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 409, 'Geting products error');
                    }
                } else {
                    return ress.create(res, 400, 'You are not admin');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async createOtherProduct(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                try {
                    const sendingData = req.body;

                    //get current order number
                    let orderNumder = await database.query('SELECT * FROM current_order_number');
                    orderNumder = Number(orderNumder.rows[0].order_number) + 1;

                    let count = 1;
                    let tempOrderNumber = orderNumder;
                    let newOrderNumber = '';
                    while (tempOrderNumber > 9) {
                        tempOrderNumber = Math.floor(tempOrderNumber / 10);
                        count++;
                    }
                    for (let i = 0; i < 6 - count; i++) {
                        newOrderNumber += '0';                       
                    }
                    newOrderNumber += orderNumder;

                    const date = new Date;
                    const currentDate = `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}.${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${(date.getFullYear() % 100 < 10) ? '0' + (date.getFullYear() % 100) : date.getFullYear() % 100}`;
                    const currentTime = `${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}`;

                    try {
                        await database.query('INSERT INTO other_products (order_number, product_status, user_id, title, order_description, price, create_date, create_time, current_language) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [newOrderNumber, 1, tokenInfo.dbData.id, 'Other product', sendingData.orderDescription, sendingData.price, currentDate, currentTime, sendingData.currentLanguage]);
                        await database.query('UPDATE current_order_number SET order_number = $2 WHERE order_number = $1', [orderNumder - 1, orderNumder]);
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                    }

                    return ress.create(res, 200, newOrderNumber);
                } catch (error) {
                    console.log('Error: ' + error)
                    return ress.create(res, 409, 'Ordering error');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getUserOtherProducts(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                try {  
                    let sendData;
                    try {
                        sendData = (await database.query('SELECT * FROM other_products WHERE user_id = $1', [tokenInfo.dbData.id])).rows;

                        for (let i = 0; i < sendData.length; i++) {
                            const userData = (await database.query('SELECT * FROM person WHERE id = $1', [sendData[i].user_id])).rows[0];
                            sendData[i].email = userData.email;
                            sendData[i].nickname = userData.nickname;
                            sendData[i].tlg = userData.tlg;
                            if (sendData[i].product_status === 0) {
                                sendData[i].product_status = '<span class="en">Canceled,</span><span class="ru">Отменен,</span>';
                            } else if (sendData[i].product_status === 1) {
                                sendData[i].product_status = '<span class="en">Under consideration,</span><span class="ru">На рассмотрении,</span>';
                            } else if (sendData[i].product_status === 2) {
                                sendData[i].product_status = '<span class="en">Paid,</span><span class="ru">Оплачен,</span>';
                            } else if (sendData[i].product_status === 3) {
                                sendData[i].product_status = '<span class="en">Performed,</span><span class="ru">Выполняется,</span>';
                            } else if (sendData[i].product_status === 3) {
                                sendData[i].product_status = '<span class="en">Completed,</span><span class="ru">Выполнен,</span>';
                            }
                        }
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                    }

                    return ress.create(res, 200, sendData);
                } catch (error) {
                    console.log('Error: ' + error)
                    return ress.create(res, 409, 'Geting products error');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getAllOtherProducts(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                if (tokenInfo.dbData.roole === 'admin') {
                    try {  
                        let sendData;
                        try {
                            sendData = (await database.query('SELECT * FROM other_products')).rows;

                            for (let i = 0; i < sendData.length; i++) {
                                const userData = (await database.query('SELECT * FROM person WHERE id = $1', [sendData[i].user_id])).rows[0];
                                sendData[i].email = userData.email;
                                sendData[i].nickname = userData.nickname;
                                sendData[i].tlg = userData.tlg;
                                if (sendData[i].product_status === 0) {
                                    sendData[i].product_status = '<span class="en">Canceled,</span><span class="ru">Отменен,</span>';
                                } else if (sendData[i].product_status === 1) {
                                    sendData[i].product_status = '<span class="en">Under consideration,</span><span class="ru">На рассмотрении,</span>';
                                } else if (sendData[i].product_status === 2) {
                                    sendData[i].product_status = '<span class="en">Paid,</span><span class="ru">Оплачен,</span>';
                                } else if (sendData[i].product_status === 3) {
                                    sendData[i].product_status = '<span class="en">Performed,</span><span class="ru">Выполняется,</span>';
                                } else if (sendData[i].product_status === 3) {
                                    sendData[i].product_status = '<span class="en">Completed,</span><span class="ru">Выполнен,</span>';
                                }
                            }
                        } catch (error) {
                            console.log('Error: ' + error)
                            return ress.create(res, 500, {en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        return ress.create(res, 200, sendData);
                    } catch (error) {
                        console.log('Error: ' + error)
                        return ress.create(res, 409, 'Geting products error');
                    }
                } else {
                    return ress.create(res, 400, 'You are not admin');
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
}

module.exports = new productController();
