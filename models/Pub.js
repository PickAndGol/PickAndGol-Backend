/**
 * Created by Edu on 5/2/17.
 */

'use strict';

let mongoose = require('mongoose');
require('./Events');
let Event = mongoose.model('Event');
require('./Users');
let User = mongoose.model('userPick');

let pubSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        index: true
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    url: String,
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    photos: [{
        type: String,
        '_id': false
    }]
});

pubSchema.index({location: '2dsphere'});

pubSchema.statics.savePub = function (newPub, callback) {

    let pub = new Pub (newPub);

    pub.save(function (err, pub) {
        if (err){
            return callback(err);
        }
        return callback(err, pub);
    });
};

pubSchema.statics.findPub = function (pubData, callback) {

    Pub.findOne({name:pubData.name}).exec(function (err, pub) {
        if (err){
            return callback(err);
        }
        return callback(null, pub);
    });
};

pubSchema.statics.detailPub = function (id) {

    return new Promise(function (resolve, reject) {
        Pub.findOne({_id: id}, function (err, pub) {
            if (err) {
                reject({"code": 400, "description": err});
                return;
            }

            if (pub == null) {
                reject({"code": 404, "description": "Pub not found."});
                return;
            }

            resolve({
                "_id": pub._id,
                "name": pub.name,
                "location": pub.location,
                "url": pub.url,
                "owner": pub.owner_id,
                "events": pub.events,
                "photos": pub.photos
            });
        });
    });
};

pubSchema.statics.findPubsList = function (filter, start, limit, sort, callback) {

    let query = Pub.find(filter);

    query.skip(start);
    query.limit(limit);
    query.sort(sort);

    return query.exec(callback);
};

pubSchema.statics.total = function (filters, callback) {
    var query = Pub.find(filters); // without .exec(), still  not executed
    return query.count().exec(callback); // exec will return a promise
};

/**
 * Add event to pub
 *
 * @param pubId -> pub id
 * @param eventId -> pub id
 *
 * @return pub data or mongo error if rejected
 */
pubSchema.statics.addEvent = function (pubId, eventId) {
    // Update query configuration
    const updateEvents = {
        $addToSet: { events: eventId }
    };

    let addEventPromise = new Promise(function (resolve, reject) {
        // Add pub to favorites set
        Pub.findByIdAndUpdate(
            pubId,
            updateEvents,
            {new: true}, // Return updated object
            function (err, updateResult) {
                if (err) {
                    // Event not found
                    let error = { "code": 400, "description": err };
                    return reject(error);
                }

                const resolveData = {
                    "pub": updateResult
                };

                resolve(resolveData);
            });
    });

    return addEventPromise;
};

/**
 * Delete event from pub
 *
 * @param pubId -> pub id
 * @param eventId -> pub id
 *
 * @return pub data or mongo error if rejected
 */
pubSchema.statics.deleteEvent = function (pubId, eventId) {
    // Update query configuration
    const updateEvents = {
        $pull: { events: eventId }
    };

    let deleteEventPromise = new Promise(function (resolve, reject) {
        // Add pub to favorites set
        Pub.findByIdAndUpdate(
            pubId,
            updateEvents,
            {new: true}, // Return updated object
            function (err, updateResult) {
                if (err) {
                    // Event not found
                    let error = { "code": 400, "description": err };
                    return reject(error);
                }

                const resolveData = {
                    "pub": updateResult
                };

                resolve(resolveData);
            });
    });

    return deleteEventPromise;
};

let Pub = mongoose.model('Pub', pubSchema);