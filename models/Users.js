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

        })

    })

}

var userPick = mongoose.model('userPick',UserPickSchema);

