/**
 * Created by Edu on 5/2/17.
 */

'use strict';

let mongoose = require('mongoose');
require('./BarPicture');
let barPicture = mongoose.model('barPicture');
require('./Events');
let Event = mongoose.model('Event');

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
    function listEvents (idPub, callback) {
        Event.list({ pub: idPub }, null, null, null, function (err, rows) {
            if (err) {
                callback(err);
                return;
            }

            if (rows == null) {
                callback(null, []);
                return;
            }

            let events = [];
            for (let index in rows) {
                if (rows.hasOwnProperty(index)) {
                    events[index] = rows[index]._id;
                }
            }

            callback(null, events);
        });
    }

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

            barPicture.list(pub._id, function(err, barPictures) {
                if (err) {
                    reject({ "code": 400, "description": err });
                    return;
                }

                listEvents(pub._id, function(err, events) {
                    if (err) {
                        reject({ "code": 400, "description": err });
                        return;
                    }

                    resolve({
                        "_id": pub._id,
                        "name": pub.name,
                        "location": pub.location,
                        "url": pub.url,
                        "owner": pub.owner_id,
                        "events": events,
                        "photos": barPictures
                    });
                });
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


let Pub = mongoose.model('Pub', pubSchema);