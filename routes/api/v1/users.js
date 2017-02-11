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

let mail = require('../../../lib/mail/senderMail');
let htmlMessenger = require('../../../lib/mail/htmlMessage');

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
            })
        }).catch(function(err){
            res.json(err);
        })
    }).catch(function(err){

        console.log(err);
        res.json(err);
    })  ;

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
            res.json({success:false, data:err});
        });
    }).catch(function(err){

        res.json(err);
    });


});


router.post('/recover', function(req, res){

    let filter={};
    filter['email'] = req.body.email;
    console.log(filter);

    User.filterByField(filter).then(User.recoverPassword).then(htmlMessenger.recoverPasswordHtml).then(function(data){
        mail.sendMail(req.body.email,"Recover your pass",data);
        res.json({result: "OK", data: data});
    })
});

router.post('/forgotpass', function(req, res){

    let filter={};
    filter['resetPasswordToken'] = req.body.token;
    if (req.body.newpass1 != req.body.newpass){
        res.json({result:"ERROR", "data": {"code": 410, "description": "Pass are different"}})
        return
    }

    User.filterByField(filter).then(function(data){
        User.resetPasswordWithToken(data,req.body.newpass).then(function(data){
            res.json({result:"OK" ,data:data});
        })
    })

})


module.exports = {
    router: router,
    jwtRouter: jwtRouter
};
