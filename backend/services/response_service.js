require('dotenv').config();
const siteHost = process.env.siteHost;

class ress {
    create(res, code, sendObj, cookieArr = null) {
        try {
            res.status(code);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            
            if (cookieArr) {
                res.cookie(...cookieArr);
            }

            return res.json(sendObj);
        } catch {
            console.log('Error: send error');
            return null;
        }
    }
}

module.exports = new ress();