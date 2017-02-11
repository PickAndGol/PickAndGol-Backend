/**
 * Created by Antonio on 8/2/17.
 */
'use strict';

let nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pickandgol2017@gmail.com',
        pass: 'PickAndGoal'
    }
});



// send mail with defined transport object

var sendmail = function(mailUser, subject, htmlText){

    return new Promise(function(resolve, reject){

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"New PassWord👻" <pickandgol2017@gmail.com>', // sender address
            to: mailUser, // list of receivers
            subject: subject, // Subject line
            //text: 'Yoour link for change you password', // plain text body
            html: htmlText // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({result:"ERROR",data:"Error sending Mail"});
                console.log(error);
                return
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            resolve({result:"OK", data:"Mail send"});
            return
        });

    });


}

module.exports.sendMail =  sendmail;
