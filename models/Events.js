/**
 * Created by balate on 4/2/17.
 */

    "use strict";

//import mongoose
var mongoose = require('mongoose');

//define event schema
var eventSchema = mongoose.Schema({

    name:String,
    date: Date,
    description:String,
    photo_url:String,
    category:[String],
    pubs:[String]

});

//static method for model
eventSchema.statics.list= function(criterios,cb){

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
