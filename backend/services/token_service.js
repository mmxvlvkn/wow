const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.secret;

class TokenService {
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
}

module.exports = new TokenService();