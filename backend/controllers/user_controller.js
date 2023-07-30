const database = require('../database/database.js');
const cookieService = require('../services/cookie_service.js');
const jwt = require('jsonwebtoken');
const ress = require('../services/response_service.js');
require('dotenv').config();
const secret = process.env.secret;

class userController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async getUserInfo(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                const data = jwt.verify(tokenFromReq, secret);

                let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

                if (dbData.rows.length === 1) {
                    dbData = dbData.rows[0];
                } else {
                    return ress.create(res, 409, 'More than one account registered with email');
                }
                
                if (tokenFromReq === dbData.token) {
                    return ress.create(res, 200, {
                        nickname: dbData.nickname,
                        email: dbData.email,
                        tlg: dbData.tlg
                    });
                } else {
                    return ress.create(res, 409, 'Tokens don\'t match');
                }
            } catch (error) {
                console.log('Error: ' + error);
                return ress.create(res, 401, {en: 'Invalid token', ru: 'Неверный токен'});        

            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new userController();