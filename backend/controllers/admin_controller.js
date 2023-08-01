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
            const tokenInfo = await tokenService.userVerificationByToken(req);
            
            if (tokenInfo.status) {
                if (tokenInfo.dbData.roole === 'admin') {
                    return ress.create(res, 200, 'True');
                } else {
                    return ress.create(res, 417, 'False');
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

module.exports = new adminController();