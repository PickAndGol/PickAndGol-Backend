/**
 * Created by Edu on 5/2/17.
 */

"use strict";

let express = require("express");
let router = express.Router();

let mongoose = require('mongoose');
let Pub = mongoose.model('Pub');

let jwtAuth = require('../../../lib/jwtAuth');
router.use(jwtAuth());

router.post("/bars", function (req, res) {

    let pubName = req.name;
    let pubLat = req.lat;
    let pubLong = req.lon;
    let pubUrl = req.url;
    let pubPhoto = req.photo_url;
    let pubOwner = req.decoded.id;

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