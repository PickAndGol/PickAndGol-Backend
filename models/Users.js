/**
 * Created by Antonio on 4/2/17.
 */

'use strict';
var mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let config = require('../local_config');
let crypto = require('crypto');

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
    enabled: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    favorite_pubs: [{
        type: String,
        '_id': false
    }]
});

// This function support callback or promise

UserPickSchema.statics.saveNewUser = function(data, callback) {

    return new Promise(function (resolve,reject) {

        var usuario = new userPick();

        usuario.name = data.name;
        usuario.email = data.email;
        usuario.password = data.password;
        // For now, users are enabled at first
        //usuario.enabled = data.enabled;
        usuario.enabled = true;

        usuario.save(function (err, userSave) {

            if (err) {
                if (callback) {
                    callback(err);
                    return;
                }
                reject(err);
                return;
            }

            if (callback){
                callback(null, userSave);
                return;
            }
            resolve(userSave);
            return;

        });
    });
};

UserPickSchema.statics.existMailNotInsert = function(user, callback) {

    return new Promise(function (resolve, reject) {

        if (user){
            reject({
                "result": "ERROR",
                "data": { "code": 409, "description": "Conflict (email already exists)." }
            });
        } else {
            resolve(user);
        }
    });
};

UserPickSchema.statics.existNameNotInsert = function(user, callback) {

    return new Promise(function (resolve, reject) {

        if (user){
            reject({
                "result": "ERROR",
                "data": {"code": 409, "description": "Conflict (username already exists)."}
            });
        } else {
            resolve(user);
        }
    });
};


UserPickSchema.statics.filterByField = function(filter, callback){

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

            if (data){
                exist=true;
            }


            if (callback) {
                callback(null, exist);
                return;
            }

            resolve(data);
            return;

        });
    });
};


UserPickSchema.statics.login = function(email, password) {
    return new Promise(function(resolve, reject) {
        if (email == null || password == null) {
            reject({ "code": 400, "description": "Email and password are required." });
            return;
        }

        userPick.findOne({ email: email }, function(err, user) {
            if (err) {
                reject({ "code": 400, "description": "Bad request." });
                return;
            }

            if (user === null) {
                reject({ "code": 404, "description": "User not found." });
                return;
            }

            if (user.enabled === 'undefined' || !user.enabled) {
                reject({ "code": 403, "description": "User account disabled." });
                return;
            }

            if (user.password !== password) {
                reject({ "code": 401, "description": "Bad credentials." });
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

UserPickSchema.statics.delete = function(userId, idToDelete) {
    function validateUsers(callback) {
        if (userId !== idToDelete) {
            userPick.findOne({ _id: userId }, function(err, user) {
                if (err) {
                    callback({ "code": 400, "description": err });
                    return;
                }

                if (user.name !== "admin") {
                    callback({ "code": 403, "description": "Forbidden request." });
                }

                callback(null);
            });
        }

        callback(null);
    }

    return new Promise(function(resolve, reject) {
        validateUsers(function(err) {
            if (err) {
                reject(err);
                return;
            }

            userPick.remove({ _id: idToDelete }, function(err) {

                if (err) {
                    reject({ "code": 404, "description": "Not found." });
                    return;
                }

                resolve();
            });
        });
    });
};


UserPickSchema.statics.updateDataUser = function (jsonDataUser,recoverDataFromDb,callback) {

    return new Promise(function(resolve, reject) {

        var userUpdate = {};


        if (typeof jsonDataUser.email == 'undefined'
            && typeof jsonDataUser.name == 'undefined'
            && typeof jsonDataUser.photo_url =='undefined'
            && typeof jsonDataUser.new_password == 'undefined' ){

            reject({ result: "ERROR", data: { "code": 400, "description": "Bad request." } });
            return;
        }

        if (jsonDataUser.email){
            userUpdate['email']=jsonDataUser.email;
        }

        if (jsonDataUser.photo_url){
            userUpdate['photo_url'] = jsonDataUser.photo_url;
        }

        if (jsonDataUser.name){
            userUpdate['name'] = jsonDataUser.name;
        }


        if (jsonDataUser.new_password){

            if (jsonDataUser.old_password != recoverDataFromDb.password){

                reject({ result: "ERROR", data: { "code": 405, "description": "Password is not correct." } });
            } else {
                userUpdate['password']=jsonDataUser.new_password;
            }

        }

        userPick.update({_id: jsonDataUser.id}, {$set :userUpdate}, function(err, newData){

            resolve(newData);
        });
    });
};

UserPickSchema.statics.findUserById = function(id){
    return new Promise(function(resolve, reject) {
        userPick.findById(id, function (err, user) {

            if (err){
                reject({ result: "ERROR", data: { "code": 400, "description": "Bad request." } });
                return;
            }

            if (user){
                resolve(user);
            } else {
                reject({ "code": 404, "description": "Not found." });
            }
        });
    });
};


UserPickSchema.statics.getUser = function (idToGet, userId) {

    let userPromise = new Promise(function (resolve, reject) {
        userPick.findOne({ _id: idToGet }, function (err, user) {
            if (err) {
                // User not found
                let error = { "code": 400, "description": err };
                return reject(error);
            }

            // Cast user as Object to be able to use 'delete'
            user = user.toObject();

            // If user to get isn't the authenticathed one, don´t return email
            if (idToGet !== userId){
                delete user['email'];
            }

            resolve(user);
        });
    });

    return userPromise;
};


UserPickSchema.statics.recoverPassword = function(user){
    return new Promise(function(resolve, reject){
        let buf = crypto.randomBytes(20);
        user.resetPasswordToken =buf.toString('hex');
        user.resetPasswordExpires = Date.now() + 36000000; // 1 hour
        user.save(function (err, userSave) {

            if (err){
                reject({ result: "ERROR", data: { "code": 400, "description": "Bad request." } });
            }
            resolve(user);

        });
    });
};

UserPickSchema.statics.resetPasswordWithToken = function(user, newpass){
    return new Promise(function(resolve, reject){

        user.password=newpass;
        user.save(function (err, userSave) {


            if (err){
                reject({ result: "ERROR", data: { "code": 400, "description": "Bad request." } });
            }
            resolve(user);

        });
    });
};


/**
 * Add pub as favorite
 *
 * @param idToGet -> id of data requested user
 * @param requesterId -> id of user requesting this data
 *
 * When userId !== idToGet, email data won't be returned
 * It assumes pubId is already checked
 *
 * @return user data with favorites included, or mongo error if rejected
 */
UserPickSchema.statics.addFavoritePub = function(pubId, requesterId) {

    // Update query configuration
    const updatePub = {
        $addToSet: { favorite_pubs: pubId }
    };

    let addFavoritePromise = new Promise(function(resolve, reject) {
        // Add pub to favorites set
        userPick.findByIdAndUpdate(
            requesterId,
            updatePub,
            {new: true}, // Return updated object
            function (err, updateResult) {
                if (err) {
                    // User not found
                    let error = { "code": 400, "description": err };
                    return reject(error);
                }

                resolve(updateResult);
            });
    });

    return addFavoritePromise;
};

/**
 * Get user favorites
 *
 * @param userId -> id of user data
 *
 * @return user data with favorites included, or mongo error if rejected
 */
UserPickSchema.statics.getFavoritePubs = function(userId) {

    let getFavoritesPromise = new Promise(function(resolve, reject) {
        // Get user favorites
        userPick.findById( userId, 'favorite_pubs', function(err, favorites) {
            if (err) {
                // User not found
                let error = { "code": 400, "description": err };
                return reject(error);
            }

            resolve(favorites);
        });
    });

    return getFavoritesPromise;
};


var userPick = mongoose.model('userPick', UserPickSchema);

