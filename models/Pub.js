/**
 * Created by Edu on 5/2/17.
 */

"use strict";

let mongoose = require('mongoose');
// XXX let async = require('async');

let pubSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        index: true},
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    longitude: {
        type: Number,
        required: true},
    latitude: {
        type: Number,
        required: true},
    url: String,
    photo_url: String,
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

pubSchema.statics.findPubsList = function (filter, start, limit, sort, callback) {

    let query = Pub.find(filter);

    query.skip(start);
    query.limit(limit);
    query.sort(sort);

    return query.exec(callback);
};

var Pub = mongoose.model('Pub', pubSchema);