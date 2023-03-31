const database = require('../database/database.js');
const cookieService = require('../services/cookie_service.js');
const jwt = require('jsonwebtoken');
const {secret, siteHost} = require('../config.js');

class productController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async saveOrder(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                const data = jwt.verify(tokenFromReq, secret);

                let token = await database.query('SELECT token FROM person WHERE email = $1', [data.email]);
                if (token.rows.length === 1) {
                    token = token.rows[0].token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    try {
                        

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('OK');
                    } catch (error) {
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('Ordering error');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
}