/**
 * Created by Edu on 5/2/17.
 */

"use strict";

let mongoose = require('mongoose');
require('./BarPicture');
let barPicture = mongoose.model('barPicture');

let pubSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        index: true},
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    url: String,
    owner_id: {
        type: String,
        required: true,
        index: true}
});

pubSchema.index({location: '2dsphere'});

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
    return new Promise(function (resolve, reject) {
        Pub.findOne({_id: id}, function (err, pub) {
            if (err) {
                reject({"code": 400, "description": err});
                return;
            }

            if (pub == null) {
                reject({"code": 404, "description": "Not found."});
                return;
            }

            barPicture.list(pub._id, function(err, barPictures) {
                if (err) {
                    console.log('Error while retrieving pictures: ' + err);
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
                    "photos": barPictures
                });
            });
        });
    })
};

pubSchema.statics.findPubsList = function (filter, start, limit, sort, callback) {

    let query = Pub.find(filter);
    
    query.skip(start);
    query.limit(limit);
    query.sort(sort);

    return query.exec(callback);
};

let Pub = mongoose.model('Pub', pubSchema);