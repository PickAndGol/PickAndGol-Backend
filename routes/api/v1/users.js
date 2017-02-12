/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var express = require('express');
var router = express.Router();
let jwtRouter = express.Router();

var mongoose =require('mongoose');
require('../../../models/Users');
var User = mongoose.model('userPick');
require('../../../models/Pub');
let Pub = mongoose.model('Pub');

let jwtAuth = require('../../../lib/jwtAuth');

let mail = require('../../../lib/mail/senderMail');
let htmlMessenger = require('../../../lib/mail/htmlMessage');

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

    function sendOKResponse (data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse (data) {
        return res.json({ result: "ERROR", data: data });
    }

    let idToGet = req.params.user_id;
    let requesterId = req.decoded.id;

    User.getUser(idToGet, requesterId)
        .then(sendOKResponse)
        .catch(sendErrorResponse);

});


router.post('/register', function(req,res) {

    let filterEmail ={};
    let filterNameUser={};

    filterEmail['email']= req.body.email;
    filterNameUser['name'] = req.body.name;

    User.filterByField(filterEmail).then(User.existMailNotInsert).then(function(data){
        User.filterByField(filterNameUser).then(User.existNameNotInsert).then(function(data){
            User.saveNewUser(req.body).then(function(data){
                res.json({result: "OK", data: data});
            }).catch(function(err){
                res.json(err);
            });
        }).catch(function(err){
            res.json(err);
        });
    }).catch(function(err){

        console.log(err);
        res.json(err);
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


jwtRouter.put('/:id',function(req, res) {

    let userData={};
    userData['email'] = req.body.email;
    userData['name'] = req.body.name;
    userData['photo_url'] = req.body.photo_url;
    userData['old_password'] = req.body.old_password;
    userData['new_password'] = req.body.new_password;
    userData['id'] = req.params.id;


    User.findUserById(userData['id']).then(function(data){
        User.updateDataUser(userData, data).then(function(data){

            delete userData['old_password'];
            delete userData['new_password'];

            res.json({result: "OK", data: { data: userData}});

        }).catch(function(err){
            res.json({success:false, data:err});
        });
    }).catch(function(err){

        res.json(err);
    });
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


/**
 * POST /users/:user_id/favorites
 *
 * Return user data
 *
 * * Only authenticated users can request
 * * Email will only be returned if authenticated user is the requester
 */
jwtRouter.post('/:user_id/favorites/:pub_id', function (req, res) {

    function sendOKResponse(data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse(data) {
        return res.json({ result: "ERROR", data: data });
    }

    let userId = req.params.user_id;
    let pubId = req.params.pub_id;
    let requesterId = req.decoded.id;

    Pub.detailPub(pubId)
        .then(addFavorite)
        .catch(sendErrorResponse);

    function addFavorite (pubData){
        // Check if user is the authenticated one
        if (userId !== requesterId) {
            const errorData = { "code": 400, "description": "Bad request (User id must be the authenticated one)." };
            return sendErrorResponse(errorData);
        }

        User.addFavoritePub(pubId, userId)
            .then(sendOKResponse)
            .catch(sendErrorResponse);
    }
});


/**
 * GET /users/:user_id/favorites
 *
 * Return user favorites
 *
 * * Only authenticated users can request
 */
jwtRouter.get('/:user_id/favorites', function (req, res) {

    function sendOKResponse(data) {
        return res.json({ result: "OK", data: data });
    }

    function sendErrorResponse(data) {
        return res.json({ result: "ERROR", data: data });
    }

    let userId = req.params.user_id;

    User.getFavoritePubs(userId)
        .then(sendOKResponse)
        .catch(sendErrorResponse);

});


router.post('/recover', function(req, res){

    let filter={};
    filter['email'] = req.body.email;
    console.log(filter);

    User.filterByField(filter).then(User.recoverPassword).then(htmlMessenger.recoverPasswordHtml).then(function(data){
        mail.sendMail(req.body.email,"Recover your pass",data);
        res.json({result: "OK", data: data});
    });
});

router.post('/forgotpass', function(req, res){

    let filter={};
    filter['resetPasswordToken'] = req.body.token;
    if (req.body.newpass1 != req.body.newpass){
        res.json({result:"ERROR", "data": {"code": 410, "description": "Pass are different"}});
        return;
    }

    User.filterByField(filter).then(function (data){
        User.resetPasswordWithToken(data,req.body.newpass).then(function(data){
            res.json({result: "OK" ,data:data});
        });
    });
});


module.exports = {
    router: router,
    jwtRouter: jwtRouter
};