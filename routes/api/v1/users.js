/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
require('../../../models/Users');
let mongoose = require('mongoose');
let User = mongoose.model('User');

router.post('/register', function(req,res){

    var user = req.body.name;
    var email = req.body.mail;
    var pass = req.body.password;


    res.json({result:"ok", data:{"id":222}})


});

router.post('/login', function(req, res) {
    function sendOKResponse(data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse(data) {
        return res.json({ result: "ERROR", data: data });
    }

    let email = req.body.email || null;
    let password = req.body.password || null;

    User.login(email, password)
        .then(sendOKResponse)
        .catch(sendErrorResponse);
});

module.exports = router;