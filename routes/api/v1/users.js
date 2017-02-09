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

/**
 * GET /users/:user_id
 * 
 * Return user data
 * 
 * * Only authenticated users can request
 * * Email will only be returned if authenticated user is the requester
 */
jwtRouter.get('/:user_id', function (req, res) {
    
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

jwtRouter.put('/:id',function(req, res) {

    let userData={};
    userData['email'] = req.body.email;
    userData['name'] = req.body.name;
    userData['photo_url'] = req.body.photo_url;
    userData['old_password'] = req.body.old_password;
    userData['new_password'] = req.body.new_password;
    userData['id'] = req.params.id

    User.findUserById(userData['id']).then(function(data){
        User.updateDataUser(userData, data).then(function(data){

            delete userData['old_password'];
            delete userData['new_password'];

            res.json({result: "OK", data: { data: userData}});

        }).catch(function(err){
            res.json({success:false, payload:err});
        });
    });


});

module.exports = {
    router: router,
    jwtRouter: jwtRouter
};
