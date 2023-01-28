const nodemailer = require('nodemailer');
const config = require('../config.js');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.emailToSendHost,
            port: config.emailToSendPort,
            secure: config.emailToSendSecureMode,
            auth: {
                user: config.emailToSend,
                pass: config.emailToSendPassword
            }
        })
    }

    async sendActivationCode(to, code) {
        await this.transporter.sendMail({
            from: config.emailToSend,
            to,
            subject: 'Активация аккаунта на ' + config.siteHost,
            text: '',
            html: 
                `
                    <div style="padding:15px;height:500px;width:300px;background-color:#050622;border:2px solid #564fff;border-radius:4px;">
                        <h1 style="margin-bottom:30px;color:white;font-size:30px">Код активации:</h1>
                        <p style="color:#cfcfcf;font-size:24px;font-weight:bold;">${String(code)}</p>
                    </div>
                `
        });
    }
}

module.exports = new EmailService();