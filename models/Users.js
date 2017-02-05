/**
 * Created by Antonio on 4/2/17.
 */

'use strict';

var mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let config = require('../local_config');

var UserSchema = mongoose.Schema({
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

UserSchema.statics.saveNewUser = function(data, callback) {

    return new Promise(function(resolve,reject) {

        var usuario = new Usuario();

        usuario.name = data.name;
        usuario.email = data.email;
        usuario.password = data.password;

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

        })

    })

}

UserSchema.statics.login = function(email, password) {
    return new Promise(function(resolve, reject) {
        if (email == null || password == null) {
            reject({ code: 400, description: "Email and password are required." });
            return;
        }

        Usuario.findOne({ email: email }, function(err, user) {
            console.log('En findone');
            if (err) {
                reject({ code: 400, description: "Bad request." });
                return;
            }
            console.log('Encontrado ' + user.name);
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

var Usuario = mongoose.model('User',UserSchema);

