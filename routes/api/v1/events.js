/**
 * Created by balate on 4/2/17.
 */
"use strict";

var express = require('express');
var router = express.Router();
let jwtRouter = express.Router();

var mongoose = require('mongoose');

var Event = mongoose.model('Event');

var Events = require('../../../models/Events');

let jwtAuth = require('../../../lib/jwtAuth');

jwtRouter.use(jwtAuth());

//POST create new event
router.post('/', function(req, res) {

    var newEvent = req.body;

    var event = new Events(newEvent);


    event.save(function(err,created){
        if(err){
            console.log(err);
            return res.json({
                "result" : "ERROR",
                "data": { "code": 403, "description": "Forbidden request." }
            });
        }
        res.json({ok:true,event:created});
    });

});

//GET/events list
router.get('/', function(req, res) {

    var pub = req.query.pub;// asignarle el valor que devuelve de la lista de bares
    //var today = new Date().getDate();
    var name = req.query.name;
    var date = req.query.date;
    var description = req.query.description;
    var start = req.query.start;
    var limit = parseInt(req.query.limit) || 6;
    var sort = req.query.sort || null;



    var criteria = {};

    if (typeof pub !== 'undefined'){
        criteria.pub = pub;
    }

    if (typeof name !== 'undefined'){
        criteria.name = name;
    }

    if (typeof description !== 'undefined'){
        criteria.description = description;
    }
    if (typeof date !== 'undefined'){
        criteria.date = date;
    }

    Events.list(criteria,start,limit,sort, function(err,rows){
        if(err){
            console.log(err);
            return res.json({
                "result": "error",
                "data": {"code": 400, "description": "Bad request."}
            });
        }
        res.json({ok: true, data: rows});
    });
});


module.exports = {
    router : router,
    jwtRouter: jwtRouter};