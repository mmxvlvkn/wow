const database = require('../database/database.js');
const tokenService = require('../services/token_service.js');
const jwt = require('jsonwebtoken');
const ress = require('../services/response_service.js');
require('dotenv').config();
const secret = process.env.secret;

class adminController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async isAdmin(req, res) {
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
                    if (dbData.roole === 'admin') {
                        return ress.create(res, 200, 'True');
                    } else {
                        return ress.create(res, 417, 'False');
                    }

                    
                } else {
                    return ress.create(res, 409, 'Tokens don\'t match');
                }
            } catch (error) {
                return ress.create(res, 401, 'Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            return ress.create(res, 500, {en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new adminController();