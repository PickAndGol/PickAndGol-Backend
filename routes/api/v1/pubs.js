/**
 * Created by Edu on 5/2/17.
 */

'use strict';

let wordSearch = require ('../../../lib/wordSearch');

let express = require('express');
let jwtRouter = express.Router();
let router = express.Router();

let mongoose = require('mongoose');
require('../../../models/Pub');
let Pub = mongoose.model('Pub');

let jwtAuth = require('../../../lib/jwtAuth');
jwtRouter.use(jwtAuth());

jwtRouter.post("/", function (req, res) {

    let pub = req.body;
    let pubName = pub.name;
    let pubLat = pub.latitude;
    let pubLong = pub.longitude;
    let pubUrl = pub.url;
    let pubPhoto = pub.photo_url;

    let pubOwner = pub.user_id || req.decoded.id;

    if (pubName === 'undefined' || pubLat === 'undefined'
        || pubLong === 'undefined' ){

        return res.json({
            "result": "ERROR",
            "data": { "code": 400, "description": "Pub name and location required" }
        });
    } else if (pubOwner === 'undefined') {
        return res.json({
            "result": "ERROR",
            "data": { "code": 400, "description": "User not found" }
        });
    }

    let pubData = new Pub();
    pubData.name = pubName;
    pubData.location.type = "Point";
    pubData.location.coordinates = [pubLong, pubLat];
    pubData.url = pubUrl;
    pubData.owner_id = pubOwner;

	if (pubPhoto !== 'undefined' && Array.isArray(pubPhoto)) {
		pubData.photos = pubPhoto.split(',');
	}

    // Check if already exists
    Pub.findPub(pubData, function (err, pub) {
        if (err){
            return res.json({"result": "ERROR", "data": { "code": 500 }});
        }
        if (pub){
            return res.json({
                "result": "ERROR",
                "data": { "code": 409, "description": "Pub already exists" }
            });
        }
        // If not exist we will create
        Pub.savePub(pubData, function (err, pub) {
            if (err){
                return res.json({"result": "ERROR", "data": { "code": 500, "data": err }});
            }
            console.log('Bar guardado', pub);
            return res.json({"result":"OK", "data":pub});
        });
    });
});

// GET pub
router.get('/:id', function(req, res) {
    let id = req.params.id;

    function sendOKResponse(data) {
        return res.json({ "result": "OK", "data": data });
    }

    function sendErrorResponse(data) {
        return res.json({ "result": "ERROR", "data": data });
    }

    Pub.detailPub(id)
        .then(sendOKResponse)
        .catch(sendErrorResponse);
});


// Get pubs list
router.get('/', function (req, res) {

    let query = req.query;
    let event = query.event;
    let latitude =  parseFloat(query.latitude);
    let longitude = parseFloat(query.longitude);
    let radius = parseInt(query.radius);
    let name = query.text;

    let start = parseInt(query.offset) || 0;
    let limit = parseInt(query.limit) || 20;
    let sort = query.sort || query.name;

    let searchCriteria = {};

    if (latitude && longitude) {
        searchCriteria.location = {
            $nearSphere : {
                $geometry: {
                    type: "Point" ,
                    coordinates: [ longitude , latitude ]
                }
            }
        };

        if (radius) {
            searchCriteria.location.$nearSphere.$maxDistance = radius;
        }

    }

    if (typeof name !== 'undefined'){
        searchCriteria.name = wordSearch(name);
    }

    if (typeof event !== 'undefined'){
        searchCriteria.events = event;
    }

    const listPromise = Pub.findPubsList(searchCriteria,start,limit,sort);
    const totalPromise = Pub.total(searchCriteria);
    const promises = [listPromise, totalPromise];

    Promise.all(promises)
        .then(([pubs, total]) => {
            return res.json({
                "result":"OK",
                "data":{
                    "total": total,
                    "items": pubs }
            });
        })
        .catch((error) => {
            return res.json({
                "result": "ERROR",
                "data": {
                    "code": 400,
                    "description": "Bad request.",
                    "mongoError": error
                }
            });
        });
});

module.exports = {
    router: router,
    jwtRouter: jwtRouter
};
