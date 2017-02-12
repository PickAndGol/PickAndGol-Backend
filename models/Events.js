/**
 * Created by balate on 4/2/17.
 */

    "use strict";

//import mongoose
var mongoose = require('mongoose');

//define event schema
var eventSchema = mongoose.Schema({

    name:   {type: String,
            required: true,
            index: true},
    date:   {type: Date,
            required: true,
            index: true},
    description: {type: String,
                required: false},
    photo_url:  {type: String,
                required: false},
    category: {type: [Number],
                required: true},
    pub:   {type: [Number],
            required: true}

});

//static method for model
eventSchema.statics.list = function(filter, start, limit, sort, cb){
     var query = Event.find(filter);
     query.sort({date: -1});//desc date
     query.select('name description date category pub photo_url');
     query.skip(start);
     query.limit(limit);
     query.sort(sort);
     console.log(filter);
     return query.exec(cb);
};


eventSchema.statics.findEvent = function (eventData, cb) {
    Event.findOne({name:eventData.name}).exec(function (err, event) {
        if (err){
            return cb(err);
        }
        return event(null, event)
    })
};

//export model
var Event = mongoose.model('Event',eventSchema);

module.exports = Event;
