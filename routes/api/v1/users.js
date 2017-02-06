/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
var modelUsuarios = require('../../../models/Users');

router.post('/register', function(req,res){

    var user = req.body.name;
    var email = req.body.mail;
    var pass = req.body.password;


    res.json({result:"ok", data:{"id":222}})


});

module.exports = router;