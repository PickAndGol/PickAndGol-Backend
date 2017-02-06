/**
 * Created by balate on 4/2/17.
 */
"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

//var Event = mongoose.model('Event');

//require model
var Events = require('../../../models/Events');


//POST create new event
router.post('/', function(req, res, next) {

    var newEvent = req.body;
    //var event = new Event({name: 'Madrid vs Barca',date:'11/04/2017', description: 'Football match in Moes Bar', photo_url: null, category: ["soccer","pick", "bar"]});

    var event = new Events(newEvent);


    event.save(function(err,create){
        if(err){
            console.log(err);
            return res.json({ok:false,error:err});
        }
        res.json({ok:true,event:create});
    });

});

module.exports = router;
