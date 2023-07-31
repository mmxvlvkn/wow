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
    async changeUserNickname(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            const data = jwt.verify(tokenFromReq, secret);

            let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

            if (dbData.rows.length === 1) {
                dbData = dbData.rows[0];
            } else {
                return ress.create(res, 409, 'More than one account registered with email');
            }
            
            if (tokenFromReq === dbData.token) {
                if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test(req.body.newNickname))) {
                    return ress.create(res, 409, {en: 'Incorrect nickname', ru: 'Некорректный никнейм'});
                } else {
                    const otherUsers = await database.query('SELECT * FROM person WHERE nickname = $1', [req.body.newNickname]);
                    if (otherUsers.rows.length) {
                        return ress.create(res, 409, {en: 'User with this nickname already exists', ru: 'Пользователь с таким никнеймом уже существует'});
                    } else {
                        try {
                            await database.query('UPDATE person SET nickname = $2 WHERE email = $1', [data.email, req.body.newNickname]);
                            return ress.create(res, 200, 'OK');
                        } catch (error) {
                            console.log('Error: ' + error);
                            return ress.create(res, 409, {en: 'Change nickname error', ru: 'Ошибка изменения никнейма'});
                        }
                    }
                }
            } else {
                return ress.create(res, 409, 'Tokens don\'t match');
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async changeUserTlg(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            const data = jwt.verify(tokenFromReq, secret);

            let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

            if (dbData.rows.length === 1) {
                dbData = dbData.rows[0];
            } else {
                return ress.create(res, 409, 'More than one account registered with email');
            }
            
            if (tokenFromReq === dbData.token) {
                if (!(/^[@]{1}[^а-яё]+$/.test(req.body.newTlg))) {
                    return ress.create(res, 409, {en: 'Incorrect telegram', ru: 'Некорректный телеграмм'});
                } else {
                    try {
                        await database.query('UPDATE person SET tlg = $2 WHERE email = $1', [data.email, req.body.newTlg]);
                        return ress.create(res, 200, 'OK');
                    } catch (error) {
                        console.log('Error: ' + error);
                        return ress.create(res, 409, {en: 'Change telegram error', ru: 'Ошибка изменения телеграмма'});
                    }
                }
            } else {
                return ress.create(res, 409, 'Tokens don\'t match');
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new userController();