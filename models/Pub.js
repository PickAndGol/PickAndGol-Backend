/**
 * Created by Edu on 5/2/17.
 */

"use strict";

let mongoose = require('mongoose');

let pubSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        index: true},
    longitude: {
        type: Number,
        required: true},
    latitude: {
        type: Number,
        required: true},
    url: String,
    owner_id: {
        type: String,
        required: true,
        index: true}
});

pubSchema.statics.savePub = function (newPub, callback) {

    let pub = new Pub (newPub);

    pub.save(function (err, pub) {
        if (err){
            return callback(err);
        }
        return callback(err, pub);
    })
};

pubSchema.statics.findPub = function (pubData, callback) {

    Pub.findOne({name:pubData.name}).exec(function (err, pub) {
        if (err){
            return callback(err);
        }
        return callback(null, pub)
    })
};

pubSchema.statics.detailPub = function(id) {
    return new Promise(function(resolve, reject) {
        Pub.findOne({ _id: id }, function(err, pub) {
            if (err) {
                reject({ "code": 400, "description": err });
                return;
            }

            console.log('contenido de pub: ' + pub);
            if (pub == null) {
                reject({ "code": 404, "description": "Not found." });
                return;
            }

            resolve({
                "id": pub._id,
                "name": pub.name,
                "latitude": pub.latitude,
                "longitude": pub.longitude,
                "url": pub.url,
                "owner": pub.owner_id,
                "events": [],
                "photos": []
            });
        });
    });
};

var Pub = mongoose.model('Pub', pubSchema);