/**
 * Created by Antonio on 4/2/17.
 */

'use strict';
var mongoose = require('mongoose');

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
    photo_url: String

});

// This function support callback or promise

UserPickSchema.statics.saveNewUser = function(data, callback) {

    return new Promise(function(resolve,reject) {

        var usuario = new userPick();

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

        });



    })

}


UserPickSchema.statics.existMail = function(email, callback) {

    return new Promise(function (resolve, reject) {

        var field = {}
        field['email'] = email;
        filterByField(field,null).then(function(data, err){

            if(err){
                if (callback) {
                    console.log(err);
                    callback(err, null);
                    return;
                }

                reject("NOK");
                return;
            }
            if (callback) {
                callback(null, data);
                return
            }
            resolve(data);
            return;

        });

    });
}

UserPickSchema.statics.existName = function(nameUser, callback) {

    return new Promise(function (resolve, reject) {

        var field = {}
        field['name'] = nameUser;
        filterByField(field,null).then(function(data, err){

            if(err){
                if (callback) {
                    console.log(err);
                    callback(err, null);
                    return;
                }

                reject("NOK");
                return;
            }
            if (callback) {
                callback(null, data);
                return
            }
            resolve(data);
            return;

        });

    });
}


var filterByField = function(filter, callback){

    return new Promise(function(resolve, reject){

        var exist=false;


        userPick.findOne(filter, function (error, data) {


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


var userPick = mongoose.model('userPick',UserPickSchema);

