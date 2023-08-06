const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.secret;
const database = require('../database/database.js');

class TokenService {
    constructor() {
        this.userVerificationByToken = this.userVerificationByToken.bind(this);
    }

    findCookieByKey(req, keyName) {
        try {
            const regExpForCookieKey = new RegExp(`^${keyName}`);
            let cookie;

            req.headers.cookie.split('; ').some(cookieItem => {
                if (regExpForCookieKey.test(cookieItem)) {
                    cookie = cookieItem.match(/=.*/)[0].slice(1);

                    if (/%20/.test(token)) {
                        cookie = cookie.split('%20')[1];
                    } else {
                        cookie = cookie.split(' ')[1];
                        console.log('Space found in token: \'Bearer \$\{token \}\';')
                    }

                    return cookie;
                }
            });

            return token;
        } catch (error) {
            console.log('Error: Error in search function for cookies by key');
            throw new Error('Error in search function for cookies by key');
        }
    }
    getToken(req) {
        try {
            const regExpForCookieKey = new RegExp(`^token`);
            let token;

            req.headers.cookie.split('; ').some(cookieItem => {
                if (regExpForCookieKey.test(cookieItem)) {
                    token = cookieItem.match(/=.*/)[0].slice(1);

                    if (/%20/.test(token)) {
                        token = token.split('%20')[1];
                    } else {
                        token = token.split(' ')[1];
                        console.log('Space found in token: \'Bearer \$\{token \}\';')
                    }

                    return token;
                }
            });

            return token;
        } catch (error) {
            console.log('Error: get token error');
            throw new Error('Get token error');
        }
    }
    generateAccessToken(email, role, exp) {
        const payload = {
            email,
            role
        }
        
        return jwt.sign(payload, secret, {expiresIn: exp});
    }
    async userVerificationByToken(req) {
        try {
            const tokenFromReq = this.getToken(req);
            let tokenData;
            jwt.verify(tokenFromReq, secret, async (err, payload) => {
                if (err) {
                    return {status: false};
                } else {
                    tokenData = payload;
                }
            });

            let dbData = await database.query('SELECT * FROM person WHERE email = $1', [tokenData.email]);
            
            if (dbData.rows.length === 1) {
                dbData = dbData.rows[0];
                return (tokenFromReq !== dbData.token) ? {status: false} : {status: true, tokenData, dbData};
            } else {
                console.log('Error: more than one account registered with email');
                return {status: false};
            }
        } catch (error) {
            console.log('Error: ' + error);
            throw error;
        }
    }
}

module.exports = new TokenService();