module.exports = {
    jwt: {
        secret: process.env.TOKEN_SECRET || '<TOKEN>'
    },
    smtpConfig: {
        service: '<EMAIL_SERVICE>',
        auth: {
            user: '<USER_EMAIL>',
            pass: '<EMAIL_PASSWORD>'
        }
    }
};