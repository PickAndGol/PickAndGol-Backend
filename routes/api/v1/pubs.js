/**
 * Created by Edu on 5/2/17.
 */

"use strict";

let express = require("express");
let router = express.Router();

require('../../../models/Pub');
let mongoose = require('mongoose');
require('../../../models/Pub');
let Pub = mongoose.model('Pub');

let jwtAuth = require('../../../lib/jwtAuth');
jwtRouter.use(jwtAuth());

jwtRouter.post("/pubs", function (req, res) {

    let pub = req.body;
    let pubName = pub.name;
    let pubLat = pub.lat;
    let pubLong = pub.lon;
    let pubUrl = pub.url;
    let pubPhoto = pub.photo_url;

    let pubOwner = pub.user_id;
    if (pubOwner === 'undefined') {
        pubOwner = pub.decoded.id;
    }

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
    pubData.location.coordinates = [pubLat, pubLong];
    pubData.url = pubUrl;
    pubData.photo_url = pubPhoto;
    pubData.owner_id = pubOwner;


    // Check if already exists
    Pub.findPub(pubData, function (err, pub) {
        if (err){
            return res.json({"result": "ERROR", "data": { "code": 500 }});
        }
        if (pub){
            console.log(pub);
            return res.json({
                    "result": "ERROR",
                    "data": { "code": 409, "description": "Pub already exists" }
                }
            );
        }
        // If not exist we will create
        Pub.savePub(pubData, function (err, pub) {
            if (err){
                return res.json({"result": "ERROR", "data": { "code": 500 }});
            }
            console.log('Bar guardado', pub);
            return res.json({"result":"OK", "data":pub});
        });

    })

});

router.get('/pubs', function (req, res) {

    let query = req.query;
    let latitude =  parseFloat(query.latitude);
    let longitude = parseFloat(query.longitude);
    let radius = parseInt(query.radius) || 1000; //1km por defecto
    let name = query.text;

    let start = parseInt(query.offset) || 0;
    let limit = parseInt(query.limit) || 20;
    let sort = query.sort || query.name;

    let searchCriteria = {};

    if (typeof latitude !== 'undefined'
        && longitude !== 'undefined'
        && radius !== 'undefined') {

        searchCriteria.location = {
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [latitude, longitude]
                    },
                    $maxDistance: radius
                }
            }
        };

    }

    if (typeof name !== 'undefined'){
        searchCriteria.name = new RegExp('^' + name, 'i');
    }

    return Pub.findPubsList(searchCriteria, start, limit, sort, function (err, pubs) {
        if (err){
            return res.json({
                "result": "ERROR",
                "data": {
                    "code": 400,
                    "description": "Bad request" }
            });
        }
        return res.json({
            "result":"OK",
            "data":{
                "numberOfPubs":pubs.count,
                "items": pubs }
        });
    })
});

module.exports = router;