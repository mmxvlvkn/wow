const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.emailToSendHost,
            port: process.env.emailToSendPort,
            secure: process.env.emailToSendSecureMode,
            auth: {
                user: process.env.emailToSend,
                pass: process.env.emailToSendPassword
            },
        })
    }

    async sendActivationCode(to, code) {
        try {
            await this.transporter.sendMail({
                from: process.env.emailToSend,
                to,
                subject: 'Account activation on ' + process.env.siteHost,
                text: '',
                html: 
                    `
                        <div style="padding:15px;height:500px;width:300px;background-color:#050622;border:2px solid #564fff;border-radius:4px;">
                            <h1 style="margin-bottom:30px;color:white;font-size:30px">Activation code:</h1>
                            <p style="color:#cfcfcf;font-size:24px;font-weight:bold;">${String(code)}</p>
                        </div>
                    `
            });
        } catch (error) {
            console.log('Error: ' + error + ',(send activation code error)');
            throw new Error('Send activation code error');
        }
            
    }

    async sendRefreshCode(to, code) {
        try {
            await this.transporter.sendMail({
                from: process.env.emailToSend,
                to,
                subject: 'Password recovery code on ' + process.env.siteHost,
                text: '',
                html: 
                    `
                        <div style="padding:15px;height:500px;width:300px;background-color:#050622;border:2px solid #564fff;border-radius:4px;">
                            <h1 style="margin-bottom:30px;color:white;font-size:30px">Recovery code:</h1>
                            <p style="color:#cfcfcf;font-size:24px;font-weight:bold;">${String(code)}</p>
                        </div>
                    `
            });
        } catch (error) {
            console.log('Error: send refresh code error');
        }
    }
    generateEmailCode() {
        // Returns a string with a six digit number

        return String(Math.floor(Math.random() * (1000000 - 100000) + 100000));
    }
}

module.exports = new EmailService();