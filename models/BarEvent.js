'use strict';

let mongoose = require('mongoose');

let BarEventSchema = mongoose.Schema({
    bar_id: {
        type: String,
        required: true,
        index: true
    },
    event_id: {
        type: String,
        required: true,
        index: true
    }
});

BarEventSchema.statics.listPubsForEvent = function(eventId, callback) {
    BarEvent.find({ event_id: eventId }, function(err, barEvent) {
        if (err) {
            return callback(err);
        }

        let pubs = [];
        for (let index in barEvent) {
            if (barEvent.hasOwnProperty(index)) {
                pubs[index] = barEvent[index].bar_id;
            }
        }

        return callback(null, pubs);
    });
};

let BarEvent = mongoose.model('BarEvent', BarEventSchema);