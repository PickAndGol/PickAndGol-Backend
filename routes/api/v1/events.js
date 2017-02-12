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
require('../../../models/BarEvent');
let BarEvent = mongoose.model('BarEvent');

let jwtAuth = require('../../../lib/jwtAuth');

jwtRouter.use(jwtAuth());

//POST create new event
router.post('/', function(req, res) {
    let newEvent = {
        name: req.body.name,
        date: req.body.date,
        category: req.body.category,
        description: req.body.description || "",
        photo_url: req.body.photo_url || ""
    };

    var event = new Events(newEvent);

    event.save(function(err,created){
        if(err){
            console.log(err);
            return res.json({
                "result" : "ERROR",
                "data": { "code": 403, "description": "Forbidden request." }
            });
        }

        let newBarEvent = new BarEvent({
            bar_id: req.body.pub,
            event_id: created._id
        });

        newBarEvent.save(function(err, barEvent) {
            if (err) {
                return res.json({
                    "result": "ERROR",
                    "data": { "code": 400, "description": err }
                });
            }

            res.json({ok:true,event:created});
        });
    });

});

//GET/events list
router.get('/', function(req, res) {

    var pub = req.query.pub;// asignarle el valor que devuelve de la lista de bares
    //var today = new Date().getDate();
    var name = req.query.name;
    var category = req.query.category;
    var date = req.query.date;
    var description = req.query.description;
    var start = req.query.start;
    var limit = parseInt(req.query.limit) || 20;
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
    if (typeof category !== 'undefined'){
        criteria.category = category;
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

router.get('/:id', function(req, res) {
    let id = req.params.id;

    Event.findOne({ _id: id }, function(err, event) {
        if (err) {
            return res.json({ "result": "ERROR", "data": { "code": 400, "description": err } });
        }

        if (event == null) {
            return res.json({ "result": "ERROR", "data": { "code": 404, "description": "Not found." } });
        }

        BarEvent.listPubsForEvent(id, function(err, pubs) {
            if (err) {
                return res.json({ "result": "ERROR", "data": { "code": 400, "description": err } });
            }

            return res.json({ "result:": "OK", "data": {
                "id": event._id,
                "name": event.name,
                "date": event.date,
                "description": event.description,
                "photo_url": event.photo_url,
                "category_id": event.category,
                "pubs": pubs
            } });
        });
    });
});

module.exports = {
    router : router,
    jwtRouter: jwtRouter};