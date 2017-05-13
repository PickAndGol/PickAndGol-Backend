'use strict';

process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
require('../models/Users');
let User = mongoose.model('userPick');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    const BAD_REQUEST = 400;
    const USER_FIELD_CONFLICT = 409;

    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    describe('POST /api/v1/users/register', () => {
        it('it should register a new user', (done) => {
            const firstUser = createPeterParker();

            chai.request(app)
                .post('/api/v1/users/register')
                .send(firstUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('OK');
                    res.body.should.have.deep.property('data.id');
                    res.body.should.have.deep.property('data.email').equal('peter.parker@pickandgol.com');
                    res.body.should.have.deep.property('data.name').equal('Peter Parker');

                    done();
                });
        });

        it('it should fails to register a new user without email', (done) => {
            const user = {
                name: "Peter Parker",
                password: "YourFriendAndNeighbour"
            };

            testRegisterUserThatFails(user, BAD_REQUEST, done);
        });

        it('it should fails to register a new user without name', (done) => {
            const user = {
                email: "peter.parker@pickandgol.com",
                password: "YourFriendAndNeighbour"
            };

            testRegisterUserThatFails(user, BAD_REQUEST, done);
        });

        it('it should fails to register a new user without password', (done) => {
            const user = {
                email: "peter.parker@pickandgol.com",
                name: "Peter Parker"
            };

            testRegisterUserThatFails(user, BAD_REQUEST, done);
        });

        it('it should fails to register a new user with an existing email', (done) => {
            const secondUser = {
                email: "peter.parker@pickandgol.com",
                name: "Bruce Banner",
                password: "ImGreen"
            };

            const firstUser = createPeterParker();

            firstUser.save((err, user) => {
                testRegisterUserThatFails(secondUser, USER_FIELD_CONFLICT, done);
            });
        });

        it('should fails to register a new user with an existing name', (done) => {
            const secondUser = {
                email: "bruce.banner@pickandgol.com",
                name: "Peter Parker",
                password: "ImGreen"
            };

            const firstUser = createPeterParker();

            firstUser.save((err, user) => {
                testRegisterUserThatFails(secondUser, USER_FIELD_CONFLICT, done);
            });
        });

        it('should fails to register a new user with a badly formatted email', (done) => {
            const user = {
                email: "tonystarkatpickandgoldotcom",
                name: "Tony Stark",
                password: "ImIronMan"
            };

            testRegisterUserThatFails(user, BAD_REQUEST, done);
        });

        function testRegisterUserThatFails(user, errorCode, done) {
            chai.request(app)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('ERROR');
                    res.body.should.have.deep.property('data.code').equal(errorCode);
                    res.body.should.have.deep.property('data.description');

                    done();
                });
        }

        function createPeterParker() {
            return new User({
                email: "peter.parker@pickandgol.com",
                name: "Peter Parker",
                password: "YourFriendAndNeighbour"
            });
        }
    });
});