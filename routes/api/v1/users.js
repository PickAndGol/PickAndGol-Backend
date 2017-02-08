/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
let jwtRouter = express.Router();

require('../../../models/Users');
var mongoose =require('mongoose');
var User = mongoose.model('userPick');

let jwtAuth = require('../../../lib/jwtAuth');

jwtRouter.use(jwtAuth());


// Routes

jwtRouter.get('/:id', function (req, res) {
    
    function sendOKResponse(data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse(data) {
        return res.json({ result: "ERROR", data: data });
    }
    
    let idToGet = req.params.id;
    let userId = req.decoded.id;

    User.getUser(idToGet, userId)
        .then(sendOKResponse)
        .catch(sendErrorResponse);

});

router.post('/register', function(req,res) {


    User.existMail(req.body.email).then(function (data, err) {

        console.log(data);
        if(data){
            console.log("El email existe");
            res.json({
                    "result": "ERROR",
                    "data": { "code": 409, "description": "Conflict (email already exists)." }
                }
            );
        }else{
            console.log("No existe");
        }

        User.existName(req.body.name).then(function(data,err) {

            if(data){
                console.log("El usuario Existe");
                res.json({
                        "result":"ERROR",
                        "data": {"code": 409, "description": "Conflict (username already exists)."}
                    }
                );
            }

        })

        User.saveNewUser(req.body).then(function (data, err) {
            console.log(req.body);

            if (err) {
                res.json({result: "ERROR", data: req.body});
            }
        res.json({result: "OK", data: data});

        });
    });
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

jwtRouter.delete('/:id', function(req, res) {
    function sendOKResponse() {
        return res.json({ result: "OK" });
    }

    function sendErrorResponse(data) {
        return res.json({ result: "ERROR", data: data });
    }

    let idToDelete = req.params.id;
    let userId = req.decoded.id;

    User.delete(userId, idToDelete)
        .then(sendOKResponse)
        .catch(sendErrorResponse);
});

module.exports = {
    router: router,
    jwtRouter: jwtRouter
};
