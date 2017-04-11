/**
 * Created by balate on 4/2/17.
 */
'use strict';

let wordSearch = require ('../../../lib/wordSearch');

var express = require('express');
var router = express.Router();
let jwtRouter = express.Router();

var mongoose = require('mongoose');

var Events = require('../../../models/Events');
var Event = mongoose.model('Event');

require('../../../models/Pub');
let Pub = mongoose.model('Pub');


let jwtAuth = require('../../../lib/jwtAuth');
let config = require('../../../local_config');

jwtRouter.use(jwtAuth());

require('../../../models/Users');
const User = mongoose.model('userPick');

//POST create new event
jwtRouter.post('/', function (req, res) {

    function sendOKResponse (data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    const idUser = req.decoded.id;

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
            pubs: [ pubDetail._id ],
            creator: req.decoded.id
        };

        var event = new Event(newEvent);

        event.save(function (err, created){
            if (err){
                const errorData = { "code": 403, "description": "Forbidden request." };
                return sendErrorResponse(errorData);
            }

            Pub.addEvent(pubDetail._id, event._id)
                .then(sendOKResponse(created))
                .then(User.sendPushNotification(idUser, pubDetail, created))
                .catch(sendErrorResponse);
        });
    }
});

// GET events list
router.get('/', function(req, res) {

    let pub = req.query.pub;// assign value returned by pubs list

    // Filter variables
    let name = req.query.name;
    let category = req.query.category;
    let date = req.query.date;
    let description = req.query.description;
/*
    let latitude =  parseFloat(req.query.latitude);
    let longitude = parseFloat(req.query.longitude);
    let radius = parseInt(req.query.radius) || 1000; // default 1km
*/
    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 20;
    let sort = req.query.sort || null;
    let text = req.query.text;


    // Populate variables
    var populatePubData = req.query.populate_pub_data;
    var populateCreator = req.query.populate_creator;

    let criteria = {};
    let options = {};

    if (typeof pub !== 'undefined'){
        criteria.pubs = pub;
    }

    if (typeof name !== 'undefined'){
        criteria.name = wordSearch(name);
    }

    if (typeof description !== 'undefined'){
        criteria.description = wordSearch(description);
    }

    if (typeof text !== 'undefined'){
        criteria.$or = [
            {'name': wordSearch(text)},
            {'description': wordSearch(text)}
        ];
    }

    if (typeof category !== 'undefined'){
        criteria.category = category;
    }

    if (typeof date !== 'undefined'){
        criteria.date = date;
    }

    if (typeof populatePubData === 'string') {

        options.populatePubData = populatePubData;
    }

    if (populateCreator &&
        (populateCreator === "1") || populateCreator === "true") {

        options.populateCreator = true;
    }

    const listPromise = Event.list(criteria,start,limit,sort,options);
    const totalPromise = Event.total(criteria);
    const promises = [listPromise, totalPromise];

    Promise.all(promises)
        .then(([events, total]) => {
            return res.json({
                "result": "OK",
                "data": {
                    "total": total,
                    "items": events
                }
            });
        })
        .catch((error) => {
            return res.json({
                "result": "ERROR",
                "data": {
                    "code": 400,
                    "description": "Bad request."
                }
            });
        });
});


router.get('/:id', function(req, res) {

    function sendOKResponse (data) {
        if (!data) {
            return res.json({ "result": "ERROR", "data": { "code": 404, "description": "Not found." } });
        }
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    let id = req.params.id;

    let populateCreator = req.query.populate_creator;

    let options = {};

    if (populateCreator &&
        (populateCreator === "1") || populateCreator === "true") {

        options.populateCreator = true;
    }

    Event.getEventById(id, options)
        .then(sendOKResponse)
        .catch(sendErrorResponse);

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

        const pub = data[0].pub;
        const event = data[1].event;
        let response = {};
        response.pub = pub;
        response.event = event;

        return res.json({ result: "OK", data: response });
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
        const idUser = req.decoded.id;

        Promise.all(addResponses)
            .then(sendOKResponse)
            .then(User.sendPushNotification(idUser, pub, event))
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

        const pub = data[0].pub;
        const event = data[1].event;
        let response = {};
        response.pub = pub;
        response.event = event;

        return res.json({ result: "OK", data: response });
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