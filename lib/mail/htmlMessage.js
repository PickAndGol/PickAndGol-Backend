/**
 * Created by Antonio on 9/2/17.
 */

'use strict';

var recoverPasswordHtml = function(userData){

    return new Promise(function (resolve, response){

        let htmlCode = '<b>Dear '+ userData.name + '</b><br><p>For change your pass, click in this link <a href=http://pickandgol.com/user/forgotpass?token='+userData.resetPasswordToken+'>Click for reset</a></p><br><br><p>Regards</p>';
        resolve(htmlCode);
    });

}

module.exports ={
    recoverPasswordHtml:recoverPasswordHtml
}


