const database = require('../database/database.js');
const bcrypt = require('bcryptjs');
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
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                return ress.create(res, 200, {
                    nickname: tokenInfo.dbData.nickname,
                    email: tokenInfo.dbData.email,
                    tlg: tokenInfo.dbData.tlg
                });
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async changeUserNickname(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test(req.body.newNickname))) {
                    return ress.create(res, 409, {en: 'Incorrect nickname', ru: 'Некорректный никнейм'});
                } else {
                    const otherUsers = await database.query('SELECT * FROM person WHERE nickname = $1', [req.body.newNickname]);
                    if (otherUsers.rows.length) {
                        return ress.create(res, 409, {en: 'User with this nickname already exists', ru: 'Пользователь с таким никнеймом уже существует'});
                    } else {
                        try {
                            await database.query('UPDATE person SET nickname = $2 WHERE email = $1', [tokenInfo.tokenData.email, req.body.newNickname]);
                            return ress.create(res, 200, 'OK');
                        } catch (error) {
                            console.log('Error: ' + error);
                            return ress.create(res, 409, {en: 'Change nickname error', ru: 'Ошибка изменения никнейма'});
                        }
                    }
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async changeUserTlg(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);

            if (tokenInfo.status) {
                if (!(/^[@]{1}[^а-яё]+$/.test(req.body.newTlg))) {
                    return ress.create(res, 409, {en: 'Incorrect telegram', ru: 'Некорректный телеграмм'});
                } else {
                    try {
                        await database.query('UPDATE person SET tlg = $2 WHERE email = $1', [tokenInfo.tokenData.email, req.body.newTlg]);
                        return ress.create(res, 200, 'OK');
                    } catch (error) {
                        console.log('Error: ' + error);
                        return ress.create(res, 409, {en: 'Change telegram error', ru: 'Ошибка изменения телеграмма'});
                    }
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async sendCodeForChangeEmail(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);
            
            if (tokenInfo.status) {
                if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.newEmail))) {
                    return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                } else {
                    const otherUsers = await database.query('SELECT * FROM person WHERE email = $1', [req.body.newEmail]);
                    if (otherUsers.rows.length) {
                        return ress.create(res, 409, {en: 'User with this email already exists', ru: 'Пользователь с такой эл. почтой уже существует'});
                    } else {
                        try {
                            const codeforOldEmail = emailService.generateEmailCode();
                            const codeforNewEmail = emailService.generateEmailCode();
                            console.log(codeforOldEmail + ';' + codeforNewEmail)
                            await database.query('UPDATE person SET code = $2 WHERE email = $1', [tokenInfo.tokenData.email, codeforOldEmail + ';' + codeforNewEmail]);
                            try {
                                console.log(tokenInfo.tokenData.email + ' ' + req.body.newEmail)
                                await emailService.sendActivationCode(tokenInfo.tokenData.email, codeforOldEmail);
                                await emailService.sendActivationCode(req.body.newEmail, codeforNewEmail);
                            } catch (error) {
                                console.log('Error: ' + error);
                                return ress.create(res, 500, {en: 'Unexpected send email code error', ru: 'Непредвиденная ошибка отправки кода регистации'}); 
                            }

                            try {
                                setTimeout(async () => {
                                    await database.query('UPDATE person SET code = $2 WHERE email = $1', [tokenInfo.tokenData.email, '']);
                                }, 1000 * 60 * 10);
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
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async changeUserEmail(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);
            
            if (tokenInfo.status) {
                if (!req.body.status) {
                    const userData = await database.query('SELECT code FROM person WHERE email = $1', [tokenInfo.tokenData.email]);

                    if (userData.rows[0].code.includes(';')) {
                        if (!(/^[0-9]{6}$/.test(req.body.code))) {
                            return ress.create(res, 409, {en: 'Incorrect code', ru: 'Некорректный код'});
                        } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.oldEmail))) {
                            return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                        } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.newEmail))) {
                            return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                        } else if (userData.rows[0].code.split(';')[0] !== req.body.code) {
                            return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'});
                        }else {
                            try {
                                await database.query('UPDATE person SET code = $2 WHERE email = $1', [tokenInfo.tokenData.email, userData.rows[0].code.split(';')[1]]);

                                return ress.create(res, 200, 'OK');
                            } catch (error) {
                                console.log('Error: ' + error);
                                return ress.create(res, 409, {en: 'Change email error', ru: 'Ошибка изменения эл. почты'});
                            }
                        }
                    } else {
                        return ress.create(res, 409, {en: 'Change email error', ru: 'Ошибка изменения эл. почты'});
                    }
                } else {
                    const userData = await database.query('SELECT code FROM person WHERE email = $1', [tokenInfo.tokenData.email]);
                    console.log("OK")
                    if (!userData.rows[0].code.includes(';')) {
                        
                        if (!(/^[0-9]{6}$/.test(req.body.code))) {
                            return ress.create(res, 409, {en: 'Incorrect code', ru: 'Некорректный код'});
                        } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.oldEmail))) {
                            return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                        } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.newEmail))) {
                            return ress.create(res, 409, {en: 'Incorrect email', ru: 'Некорректная эл. почта'});
                        } else if (userData.rows[0].code.split(';')[0] !== req.body.code) {
                            return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'});
                        }else {
                            try {
                                await database.query('UPDATE person SET email = $2 WHERE email = $1', [tokenInfo.tokenData.email, req.body.newEmail]);

                                const token = tokenService.generateAccessToken(req.body.newEmail, tokenInfo.dbData.roole, '720h');
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
                        return ress.create(res, 409, {en: 'Change email error', ru: 'Ошибка изменения эл. почты'});
                    }                    
                }
                
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async sendCodeForSetPass(req, res) {
        try {
            const tokenInfo = await tokenService.userVerificationByToken(req);
            
            if (tokenInfo.status) {
                if (req.body.newPass.length < 6) {
                    return ress.create(res, 409, {en: 'Password less than 6 characters', ru: 'Пароль меньше 6 символов'});
                } else if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.newPass))) {
                    return ress.create(res, 409, {en: 'Incorrect new password', ru: 'Новый пароль не верен'});
                } 
                
                const userPass = (await database.query('SELECT pass FROM person WHERE email = $1', [tokenInfo.tokenData.email])).rows[0].pass;
                if (!bcrypt.compareSync(req.body.currentPass, userPass)) {
                    return ress.create(res, 409, {en: 'The current password is not correct', ru: 'Текущий пароль введен не верно'});
                } else {
                    try {
                        const code = emailService.generateEmailCode();
                        await database.query('UPDATE person SET code = $2 WHERE email = $1', [tokenInfo.tokenData.email, code]);
                        try {
                            await emailService.sendActivationCode(tokenInfo.tokenData.email, code);
                        } catch (error) {
                            console.log('Error: ' + error);
                            return ress.create(res, 500, {en: 'Unexpected send email code error', ru: 'Непредвиденная ошибка отправки кода регистации'}); 
                        }

                        try {
                            setTimeout(async () => {
                                await database.query('UPDATE person SET code = $2 WHERE email = $1', [tokenInfo.tokenData.email, '']);
                            }, 1000 * 60 * 5);
                        } catch (error) {
                            console.log('Error: ' + 'Delete code eroor');
                        }

                        return ress.create(res, 200, 'OK');
                    } catch (error) {
                        console.log('Error: ' + error);
                        return ress.create(res, 409, {en: 'Change password error', ru: 'Ошибка изменения пароля'});
                    }
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async changeUserPassword(req, res) {
        try {
            console.log('123')
            const tokenInfo = await tokenService.userVerificationByToken(req);
            if (tokenInfo.status) {
                
                if (req.body.newPass.length < 6) {
                    return ress.create(res, 409, {en: 'Password less than 6 characters', ru: 'Пароль меньше 6 символов'});
                } else if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.newPass))) {
                    return ress.create(res, 409, {en: 'Incorrect new password', ru: 'Новый пароль не верен'});
                }  else if (tokenInfo.dbData.code !== req.body.code) {
                    return ress.create(res, 409, {en: 'Incorrect code', ru: 'Неверный код'});
                }else {
                    try {
                        await database.query('UPDATE person SET pass = $2 WHERE email = $1', [tokenInfo.tokenData.email, bcrypt.hashSync(req.body.newPass, 7)]);

                        return ress.create(res, 200, 'OK');
                    } catch (error) {
                        console.log('Error: ' + error);
                        return ress.create(res, 409, {en: 'Change password error', ru: 'Ошибка изменения пароля'});
                    }
                }
            } else {
                return ress.create(res, 409, {en: 'Authentication error', ru: 'Ошибка аутентификации'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new userController();