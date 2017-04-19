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
    },
    token_expiration: '<TIME_IN_SECONDS>',
    firebase_api_key: '<FIREBASE_KEY_API>'
};