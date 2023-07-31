const database = require('../database/database.js');
const tokenService = require('../services/token_service.js');
const emailService = require('../services/email_service.js');
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
            const tokenFromReq = tokenService.getToken(req);

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
            const tokenFromReq = tokenService.getToken(req);

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
            const tokenFromReq = tokenService.getToken(req);

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
    async sendCodeForChangeEmail(req, res) {
        try {
            const tokenFromReq = tokenService.getToken(req);

            const data = jwt.verify(tokenFromReq, secret);

            let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

            if (dbData.rows.length === 1) {
                dbData = dbData.rows[0];
            } else {
                return ress.create(res, 409, 'More than one account registered with email');
            }
            
            if (tokenFromReq === dbData.token) {
                if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.newEmail))) {
                    return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                } else {
                    const otherUsers = await database.query('SELECT * FROM person WHERE email = $1', [req.body.newEmail]);
                    if (otherUsers.rows.length) {
                        return ress.create(res, 409, {en: 'User with this email already exists', ru: 'Пользователь с такой эл. почтой уже существует'});
                    } else {
                        try {
                            const code = emailService.generateEmailCode();
                            await database.query('UPDATE person SET code = $2 WHERE email = $1', [data.email, code]);
                            try {
                                await emailService.sendActivationCode(data.email, code);
                            } catch (error) {
                                console.log('Error: ' + error);
                                return ress.create(res, 500, {en: 'Unexpected send email code error', ru: 'Непредвиденная ошибка отправки кода регистации'}); 
                            }

                            try {
                                setTimeout(async () => {
                                    await database.query('UPDATE person SET code = $2 WHERE email = $1', [data.email, '']);
                                }, 1000 * 60 * 5);
                            } catch (error) {
                                console.log('Error: ' + 'Delete code eroor');
                            }

                            return ress.create(res, 200, 'OK');
                        } catch (error) {
                            console.log('Error: ' + error);
                            return ress.create(res, 409, {en: 'Change email error', ru: 'Ошибка изменения эл. почты'});
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
    async changeUserEmail(req, res) {
        try {
            const tokenFromReq = tokenService.getToken(req);

            const data = jwt.verify(tokenFromReq, secret);

            let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

            if (dbData.rows.length === 1) {
                dbData = dbData.rows[0];
            } else {
                return ress.create(res, 409, 'More than one account registered with email');
            }
            
            if (tokenFromReq === dbData.token) {
                const otherUsers = await database.query('SELECT code FROM person WHERE email = $1', [data.email]);

                if (!(/^[0-9]{6}$/.test(req.body.code))) {
                    return ress.create(res, 409, {en: 'Incorrect code', ru: 'Некорректный код'});
                } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.newEmail))) {
                    return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                } else if (otherUsers.rows[0].code !== req.body.code) {
                    return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'});
                }else {
                    try {
                        await database.query('UPDATE person SET email = $2 WHERE email = $1', [data.email, req.body.newEmail]);

                        const token = tokenService.generateAccessToken(req.body.newEmail, dbData.roole, '720h');
                        await database.query('UPDATE person SET token = $2 WHERE email = $1', [req.body.newEmail, token]);

                        return ress.create(res, 200, 'OK', ['token', `Bearer ${token}`, {
                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    }]);
                    } catch (error) {
                        console.log('Error: ' + error);
                        return ress.create(res, 409, {en: 'Change email error', ru: 'Ошибка изменения эл. почты'});
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