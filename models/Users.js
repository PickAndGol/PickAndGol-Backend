/**
 * Created by Antonio on 4/2/17.
 */

'use strict';
var mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let config = require('../local_config');

var UserPickSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        index:true
    },
    password:String,
    photo_url: String,
    enabled: Boolean
});

// This function support callback or promise

UserPickSchema.statics.saveNewUser = function(data, callback) {

    return new Promise(function(resolve,reject) {

        var usuario = new userPick();

        usuario.name = data.name;
        usuario.email = data.email;
        usuario.password = data.password;
        usuari.enabled = data.enabled;

        usuario.save(function (err, userSave) {
            if (err) {
                if (callback) {
                    callback(err);
                    return;
                }
                reject(err)
                return;
            }

            if(callback){
                callback(null, userSave);
                return;
            }

            resolve(userSave);
            return;

        });



    })

}

UserPickSchema.statics.existMail = function(email, callback) {

    return new Promise(function (resolve, reject) {

        var exist=false;
        userPick.findOne({'email': email}, 'email', function (error, data) {


            if (error) {
                if (callback) {
                    console.log(error);
                    callback(error, null);
                    return;
                }

                reject("NOK");
                return;
            }


            if(data){
                exist=true;
            }
            console.log("Resultado"+exist);

            if (callback) {
                callback(null, exist);
                return
            }

            resolve(exist);
            return;

        });


    });
}

UserPickSchema.statics.login = function(email, password) {
    return new Promise(function(resolve, reject) {
        if (email == null || password == null) {
            reject({ code: 400, description: "Email and password are required." });
            return;
        }

        userPick.findOne({ email: email }, function(err, user) {
            if (err) {
                reject({ code: 400, description: "Bad request." });
                return;
            }

            if (user.enabled === 'undefined' || !user.enabled) {
                reject({ code: 403, description: "User account disabled." });
                return;
            }

            if (user.password !== password) {
                reject({ code: 401, description: "Bad credentials." });
                return;
            }

            const TIME_TO_EXPIRE = 60 * 24;

            let token = jwt.sign({ id: user._id }, config.jwt.secret, {
                expiresIn: TIME_TO_EXPIRE
            });

            resolve({ token: token });
        });
    });
};

UserPickSchema.statics.delete = function(id) {
    return new Promise(function(resolve, reject) {
        userPick.remove({ _id: id }, function(err) {
            if (err) {
                reject({ code: 400, description: err });
                return;
            }

            resolve();
        });
    });
};

var userPick = mongoose.model('userPick',UserPickSchema);

