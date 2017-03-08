/**
 * Created by balate on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
let jwtRouter = express.Router();

var mongoose = require('mongoose');

var Events = require('../../../models/Events');
var Event = mongoose.model('Event');

require('../../../models/Pub');
let Pub = mongoose.model('Pub');

let jwtAuth = require('../../../lib/jwtAuth');

jwtRouter.use(jwtAuth());

//POST create new event
jwtRouter.post('/', function (req, res) {

    function sendOKResponse (data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    // Check if pub exists before creating event
    const pubId = req.body.pub;

    Pub.detailPub(pubId)
        .then(createEvent)
        .catch(sendErrorResponse);

    function createEvent (pubDetail){
        var newEvent = {
            name: req.body.name,
            date: req.body.date,
            category: [req.body.category],
            description: req.body.description || '',
            photo_url: req.body.photo_url || '',
            pubs: [ pubDetail._id ]
        };

        var event = new Event(newEvent);

        event.save(function (err, created){
            if (err){
                const errorData = { "code": 403, "description": "Forbidden request." };
                return sendErrorResponse(errorData);
            }

            return sendOKResponse(created);
        });

    }


});

// GET events list
router.get('/', function(req, res) {

    var pub = req.query.pub;// assign value returned by pubs list
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

    Event.list(criteria,start,limit,sort, function(err, events){
        if (err){
            console.log(err);
            return res.json({
                "result": "error",
                "data": {"code": 400, "description": "Bad request."}
            });
        }
        res.json({
            ok: true,
            data: {
                "total": events.length,
                "items": events
            }
        });
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

        return res.json({
            "result:": "OK",
            "data": event
        });
    });
});

/**
 * PUT /events/:event_id/pubs/:pub_id
 *
 * Add relation between event and pub
 *
 * * Only authenticated users can add
 */
jwtRouter.put('/:event_id/pubs/:pub_id', function (req, res) {

    function sendOKResponse (data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    let eventId = req.params.event_id;
    let pubId = req.params.pub_id;

    const pubDataPromise = Pub.detailPub(pubId);
    const eventDataPromise = Event.getEventById(eventId);

    const dataPromises = [pubDataPromise, eventDataPromise];

    Promise.all(dataPromises)
        .then(addPubToEvent)
        .catch(sendErrorResponse);

    function addPubToEvent (dataResponses){
        const pub = dataResponses[0];
        const event = dataResponses[1];

        const pubPromise = Pub.addEvent(pub._id, event._id);
        const eventPromise = Event.addPub(event._id, pub._id);

        const addResponses = [pubPromise, eventPromise];

        Promise.all(addResponses)
            .then(sendOKResponse)
            .catch(sendErrorResponse);
    }
});


/**
 * DELETE /events/:event_id/pubs/:pub_id
 *
 * Delete relation between event and pub
 *
 * * Only authenticated users can delete
 */
jwtRouter.delete('/:event_id/pubs/:pub_id', function (req, res) {

    function sendOKResponse (data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    let eventId = req.params.event_id;
    let pubId = req.params.pub_id;

    const pubDataPromise = Pub.detailPub(pubId);
    const eventDataPromise = Event.getEventById(eventId);

    const dataPromises = [pubDataPromise, eventDataPromise];

    Promise.all(dataPromises)
        .then(deletePubFromEvent)
        .catch(sendErrorResponse);

    function deletePubFromEvent (dataResponses){
        const pub = dataResponses[0];
        const event = dataResponses[1];

        const pubPromise = Pub.deleteEvent(pub._id, event._id);
        const eventPromise = Event.deletePub(event._id, pub._id);

        const deleteResponses = [pubPromise, eventPromise];

        Promise.all(deleteResponses)
            .then(sendOKResponse)
            .catch(sendErrorResponse);
    }
});

module.exports = {
    router : router,
    jwtRouter: jwtRouter
};