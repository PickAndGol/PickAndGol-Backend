/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
var modelUsuarios = require('../../../models/Users');
var mongoose =require('mongoose');
var User = mongoose.model('userPick');

router.post('/register', function(req,res){


    User.saveNewUser(req.body).then(function(data, err){
        console.log(req.body);

        if(err){
            res.json({result:"ERROR", data:req.body});
        }

        res.json({result:"OK", data:data});

    });





});

module.exports = router;
