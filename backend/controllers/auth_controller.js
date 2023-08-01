const database = require('../database/database.js');
const emailService = require('../services/email_service.js');
const tokenService = require('../services/token_service.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ress = require('../services/response_service.js');
require('dotenv').config();
const secret = process.env.secret;


class authController {
    constructor() {
        this.sendEmailCode = this.sendEmailCode.bind(this);
        this.singIn = this.singIn.bind(this);
        this.logIn = this.logIn.bind(this);
        this.sendRefreshEmailCode = this.sendRefreshEmailCode.bind(this);
        this.checkAccessCodeOnServer = this.checkAccessCodeOnServer.bind(this);
        this.changeUserPassword = this.changeUserPassword.bind(this);
    }

    async sendEmailCode(req, res) {
        try {
            let validationSuccessful = true;
            let errorMessage = {
                en: '',
                ru: ''
            }

            // Validation

            if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.email))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect email', ru: 'Некорректная электронная почта'};
            }
        
            if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test(req.body.nickname))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect nickname', ru: 'Некорректный никнейм'};
            }

            if (!this.stringLengthCheck(req.body.nickname, 6)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Nickname less than 6 characters', ru: 'Никнейм меньше 6 символов'};
            }
        
            if (!(/^[@]{1}[^а-яё]+$/.test(req.body.tlg))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect telegram', ru: 'Некорректный телеграм'};
            }
        
            if (!this.stringLengthCheck(req.body.tlg, 2)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Telegram less than 2 characters', ru: 'Телеграм меньше 2 символов'};
            }
        
            if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.pass))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect password', ru: 'Некорректный пароль'};
            }
        
            if (!this.stringLengthCheck(req.body.pass, 6)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Password less than 6 characters', ru: 'Пароль меньше 6 символов'};
            }

            // User absence check

            let data = await database.query('SELECT * FROM person WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'User with this email already exists', ru: 'Пользователь с такой почтой уже существует'};
            }

            data = await database.query('SELECT * FROM person WHERE nickname = $1', [req.body.nickname]);

            if (data.rows.length) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'User with this nickname already exists', ru: 'Пользователь с таким никнеймом уже существует'};
            }

            // Send error

            if (errorMessage.en) {
                return ress.create(res, 409, errorMessage); 
            }

            // Making, recording and email-sening access code

            const code = emailService.generateEmailCode();

            data = await database.query('SELECT * FROM person_bufer WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                await database.query('DELETE FROM person_bufer WHERE email = $1', [req.body.email]);
            }

            await database.query('INSERT INTO person_bufer (email, nickname, tlg, pass, roole, code) values ($1, $2, $3, $4, $5, $6)', [req.body.email, req.body.nickname, req.body.tlg, bcrypt.hashSync(req.body.pass, 7), 'user', code]);

            try {
                await emailService.sendActivationCode(req.body.email, code);
            } catch (error) {
                try {
                    await emailService.sendActivationCode(req.body.email, code);
                } catch (error) {
                    return ress.create(res, 500, {en: 'Unexpected send email code error', ru: 'Непредвиденная ошибка отправки кода регистации'}); 

                }
            }

            // Send ressponse
            return ress.create(res, 200, 'OK'); 
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'}); 
        }
    }

    async singIn(req, res) {
        try {
            // Find an unverified user and check the code

            const data = await database.query('SELECT * FROM person_bufer WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                if (req.body.code === data.rows[0].code) {
                    // Delete account from person_bufer

                    await database.query('DELETE FROM person_bufer WHERE email = $1', [req.body.email]);

                    // Make account and token

                    const token = tokenService.generateAccessToken(req.body.email, 'user', '720h');

                    await database.query('INSERT INTO person (email, nickname, tlg, pass, roole, token) values ($1, $2, $3, $4, $5, $6)', [data.rows[0].email, data.rows[0].nickname, data.rows[0].tlg, data.rows[0].pass, 'user', token]);

                    // Send ressponse

                    return ress.create(res, 200, 'OK', ['token', `Bearer ${token}`, {
                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    }]); 
                } else {
                    return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'}); 

                }
            } else {
                return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'}); 
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'}); 
        }
    }

    async sendCodeAgain(req, res) {
        try {
            const data = await database.query('SELECT code FROM person_bufer WHERE email = $1', [req.body.email]);
            
            if (data.rows.length) {
                await emailService.sendActivationCode(req.body.email, data.rows[0].code);

                return ress.create(res, 200, 'OK');
            } else {
                return ress.create(res, 500, {en: 'Error. Register again', ru: 'Ошибка. Пройдите регистрацию снова'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error while submitting code', ru: 'Непредвиденная ошибка при отправке кода'}); 
        }
    }

    async logIn(req, res) {
        try {
            const data = await database.query('SELECT pass, roole, token FROM person WHERE email = $1', [req.body.email]);
            if (data.rows.length === 1) {
                let token = data.rows[0].token;

                if (bcrypt.compareSync(req.body.pass, data.rows[0].pass)) {
                    jwt.verify(token, secret, async (err) => {
                        if (err) {
                            token = tokenService.generateAccessToken(req.body.email, data.rows[0].roole, '720h');
                            await database.query('UPDATE person SET token = $2 WHERE email = $1', [req.body.email, token])
                        }
                    });

                    // Delete refresh email code

                    if (!data.rows[0].code) {
                        await database.query('UPDATE person SET code = $2 WHERE email = $1', [req.body.email, '']);
                    }

                    return ress.create(res, 200, 'OK', ['token', `Bearer ${token}`, {
                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    }]);
                } else {
                    return ress.create(res, 409, {en: 'Wrong password', ru: 'Неверный пароль'});
                }
            } else {
                return ress.create(res, 404, {en: 'Account not found', ru: 'Аккаунт не найден'});
            }

        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    } 

    async checkToken(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);
            
            if (tokenInfo) {
                return ress.create(res, 200, 'OK');
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    async sendRefreshEmailCode(req, res) {
        try {
            const email = req.body.email;
            const data = await database.query('SELECT * FROM person WHERE email = $1', [email]);
            let code;

            if (data.rows.length === 1) {
                if (!data.rows[0].code) {
                    code = emailService.generateEmailCode();
                } else {
                    code = data.rows[0].code;
                }

                await database.query('UPDATE person SET token = $2, code = $3 WHERE email = $1', [email, '', code]);
                
                await emailService.sendRefreshCode(email, code);
                
                return ress.create(res, 200, 'OK');
            } else {
                return ress.create(res, 404, {en: 'Account not found', ru: 'Аккаунт не найден'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    async checkAccessCodeOnServer(req, res) {
        try {
            const data = await database.query('SELECT roole, code FROM person WHERE email = $1', [req.body.email]);

            if (data.rows.length === 1) {
                if (data.rows[0].code) {
                    if (data.rows[0].code === req.body.code) {
                        const token = tokenService.generateAccessToken(req.body.email, 'refresh_pass', '20m');
                        await database.query('UPDATE person SET token = $2, code = $3 WHERE email = $1', [req.body.email, token, '']);

                        return ress.create(res, 200, 'OK', ['token', `Bearer ${token}`, {
                            maxAge: 20 * 60 * 1000,
                            httpOnly: true
                        }]);
                    } else {
                        return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'});
                    }
                } else {
                    return ress.create(res, 409, {en: 'Authorization error, please try again', ru: 'Ошибка авторизации, попробуйте снова'});
                }
            } else {
                return ress.create(res, 404, {en: 'Account not found', ru: 'Аккаунт не найден'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    sendOptions(req, res) {
        return ress.create(res, 200, 'ok');
    }

    //! Убрать у обоих паролей red border при фокусе на один
    //! При back очистить поля и error
    async changeUserPassword(req, res) {
        try {
            let passwordIsValid = true;

            if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.pass))) {
                passwordIsValid = false;
            }
        
            if (!this.stringLengthCheck(req.body.pass, 6)) {
                passwordIsValid = false;
            }

            if (passwordIsValid) {
                const tokenFromReq = tokenService.getToken(req);

                jwt.verify(tokenFromReq, secret, async (err, payload) => {
                    if (!err) {
                        if (payload.role === 'refresh_pass') {
                            const data = await database.query('SELECT * FROM person WHERE email = $1', [payload.email]);
                            if (data.rows.length === 1) {
                                if (data.rows[0].token === tokenFromReq) {
                                    const token = tokenService.generateAccessToken(data.rows[0].email, data.rows[0].roole, '720h');
                                    await database.query('UPDATE person SET token = $2, pass = $3 WHERE email = $1', [data.rows[0].email, token, bcrypt.hashSync(req.body.pass, 7)]);

                                    return ress.create(res, 200, 'ok', ['token', `Bearer ${token}`, {
                                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                                        httpOnly: true
                                    }]);
                                } else {
                                    return ress.create(res, 409, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                                }
                            } else {
                                return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                            }
                        } else {
                            return ress.create(res, 409, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                        }
                    } else {
                        return ress.create(res, 409, {en: 'Timeout expired', ru: 'Время ожидания вышло'});
                    }
                });
            } else {
                return ress.create(res, 409, {en: 'Incorrect password', ru: 'Неверный пароль'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    stringLengthCheck(str, len) {
        return str.length >= len;
    }
}

module.exports = new authController();