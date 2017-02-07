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
    category: {type: [String],
                required: true},
    pubs:   {type: [String],
            required: true}

});

//static method for model
eventSchema.statics.list = function(criterios,cb){

    //use .find() sin el callback para que me de un objeto sin ejecutar
    var query = Event.find(criterios);

    //query.sort('name');
    query.exec(function (err,rows){
        if(err){
            return cb(err);
        }
        return cb(null,rows);
    });
};

//export model
var Event = mongoose.model('Event',eventSchema);

module.exports = Event;
