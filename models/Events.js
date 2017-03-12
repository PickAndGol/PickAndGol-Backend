/**
 * Created by balate on 4/2/17.
 */

'use strict';

//import mongoose
let mongoose = require('mongoose');

//define event schema
var eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: false
    },
    photo_url: {
        type: String,
        required: false
    },
    category: {
        type: [String],
        required: true
    },
    pubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pub'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// static method for model
eventSchema.statics.list = function (filters, start, limit, sort, cb){
    var query = Event.find(filters);
    query.sort({date: -1}) // desc date
        .select('name description date category pub photo_url pubs creator')
        .skip(start)
        .limit(limit)
        .sort(sort)
        .populate('pubs', 'name');

    return query.exec(cb);
};


eventSchema.statics.total = function (filters, callback) {
    var query = Event.find(filters); // without .exec(), still  not executed
    return query.count().exec(callback); // exec will return a promise
};


eventSchema.statics.findEvent = function (eventData, cb) {
    Event.findOne({name:eventData.name}).exec(function (err, event) {
        if (err){
            return cb(err);
        }
        return event(null, event);
    });
};

/**
 * Get event by id
 *
 * @param eventId -> event id
 *
 * @return event data or mongo error if rejected
 */
eventSchema.statics.getEventById = function (eventId) {

    console.log('getEventById');

    let eventPromise = new Promise(function (resolve, reject) {
        Event.findOne({ _id: eventId }, function (err, event) {
            if (err) {
                // Event not found
                let error = { "code": 400, "description": err };
                return reject(error);
            }

            resolve(event);
        });
    });

    return eventPromise;
};

/**
 * Add pub to event
 *
 * @param eventId -> pub id
 * @param pubId -> pub id
 *
 * @return event data or mongo error if rejected
 */
eventSchema.statics.addPub = function (eventId, pubId) {

    // Update query configuration
    const updatePubs = {
        $addToSet: { pubs: pubId }
    };

    let addPubPromise = new Promise(function(resolve, reject) {
        // Add pub to favorites set
        Event.findByIdAndUpdate(
            eventId,
            updatePubs,
            {new: true}, // Return updated object
            function (err, updateResult) {
                if (err) {
                    // Event not found
                    let error = { "code": 400, "description": err };
                    return reject(error);
                }

                const resolveData = {
                    "event": updateResult
                };

                resolve(resolveData);
            });
    });

    return addPubPromise;
};

/**
 * Delete pub from event
 *
 * @param eventId -> pub id
 * @param pubId -> pub id
 *
 * @return event data or mongo error if rejected
 */
eventSchema.statics.deletePub = function (eventId, pubId) {

    // Update query configuration
    const updatePubs = {
        $pull: { pubs: pubId }
    };

    let deletePubPromise = new Promise(function(resolve, reject) {
        // Add pub to favorites set
        Event.findByIdAndUpdate(
            eventId,
            updatePubs,
            {new: true}, // Return updated object
            function (err, updateResult) {
                if (err) {
                    // Event not found
                    let error = { "code": 400, "description": err };
                    return reject(error);
                }

                const resolveData = {
                    "event": updateResult
                };

                resolve(resolveData);
            });
    });

    return deletePubPromise;
};

//export model
let Event = mongoose.model('Event', eventSchema);
