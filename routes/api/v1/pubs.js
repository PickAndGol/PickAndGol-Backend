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
router.use(jwtAuth());

router.post("/bars", function (req, res) {

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

    let pubData = new Pub({
        name: pubName,
        latitude: pubLat,
        longitude: pubLong,
        url: pubUrl,
        photo_url:pubPhoto,
        owner_id:pubOwner
    });

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

module.exports = router;