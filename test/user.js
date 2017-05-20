'use strict';

process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
require('../models/Users');
let User = mongoose.model('userPick');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;
const HttpStatus = require('http-status-codes');

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    describe('POST /api/v1/users/register', () => {
        it('it should register a new user', (done) => {
            const firstUser = createUser();

            chai.request(app)
                .post('/api/v1/users/register')
                .send(firstUser)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('OK');
                    res.body.should.have.deep.property('data.id');
                    res.body.should.have.deep.property('data.email').equal('peter.parker@pickandgol.com');
                    res.body.should.have.deep.property('data.name').equal('Peter Parker');

                    // check that the user was registered
                    User.findOne({ email: firstUser.email }, (err, user) => {
                        expect(user).to.not.equal(null);
                        expect(user.email).to.equal(firstUser.email);
                        let encodedPassword = User.encodePassword(firstUser.password);
                        expect(user.password).to.equal(encodedPassword);

                        done();
                    });
                });
        });

        it('it should fails to register a new user without email', (done) => {
            const user = {
                name: 'Peter Parker',
                password: 'YourFriendAndNeighbour'
            };

            testRegisterUserThatFails(user, HttpStatus.BAD_REQUEST, done);
        });

        it('it should fails to register a new user without name', (done) => {
            const user = {
                email: 'peter.parker@pickandgol.com',
                password: 'YourFriendAndNeighbour'
            };

            testRegisterUserThatFails(user, HttpStatus.BAD_REQUEST, done);
        });

        it('it should fails to register a new user without password', (done) => {
            const user = {
                email: 'peter.parker@pickandgol.com',
                name: 'Peter Parker'
            };

            testRegisterUserThatFails(user, HttpStatus.BAD_REQUEST, done);
        });

        it('it should fails to register a new user with an existing email', (done) => {
            const secondUser = {
                email: 'peter.parker@pickandgol.com',
                name: 'Bruce Banner',
                password: 'ImGreen'
            };

            const firstUser = createUser();

            firstUser.save((err, user) => {
                testRegisterUserThatFails(secondUser, HttpStatus.CONFLICT, done);
            });
        });

        it('it should fails to register a new user with an existing name', (done) => {
            const secondUser = {
                email: 'bruce.banner@pickandgol.com',
                name: 'Peter Parker',
                password: 'ImGreen'
            };

            const firstUser = createUser();

            firstUser.save((err, user) => {
                testRegisterUserThatFails(secondUser, HttpStatus.CONFLICT, done);
            });
        });

        it('it should fails to register a new user with a badly formatted email', (done) => {
            const user = {
                email: 'tonystarkatpickandgoldotcom',
                name: 'Tony Stark',
                password: 'ImIronMan'
            };

            chai.request(app)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('ERROR');
                    res.body.should.have.deep.property('data.code').equal(HttpStatus.BAD_REQUEST);
                    res.body.should.have.deep.property('data.description');

                    // checks that the user with bad formatted email has really not registered
                    User.findOne({ email: 'tonystarkatpickandgoldotcom' }, (error, data) => {
                        expect(data).equal(null);
                        done();
                    });
                });
        });

        function testRegisterUserThatFails(user, errorCode, done) {
            chai.request(app)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('ERROR');
                    res.body.should.have.deep.property('data.code').equal(errorCode);
                    res.body.should.have.deep.property('data.description');

                    done();
                });
        }
    });

    describe('POST /api/v1/users/login', () => {
        it('it should login ok with an existing user', (done) => {
            let firstUser = createUser();
            firstUser.enabled = true;
            firstUser.password = User.encodePassword(firstUser.password);

            firstUser.save((err, user) => {
                const loginData = {
                    email: 'peter.parker@pickandgol.com',
                    password: 'YourFriendAndNeighbour'
                };

                chai.request(app)
                    .post('/api/v1/users/login')
                    .send(loginData)
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        res.body.should.be.an('object');
                        res.body.should.have.property('result').equal('OK');
                        res.body.should.have.deep.property('data.token');

                        done();
                    });
            });
        });

        it('it should fail login with a disabled user account', (done) => {
            let firstUser = createUser();
            firstUser.password = User.encodePassword(firstUser.password);

            firstUser.save((err, user) => {
                const loginData = {
                    email: 'peter.parker@pickandgol.com',
                    password: 'YourFriendAndNeighbour'
                };

                testLoginThatFails(loginData, HttpStatus.FORBIDDEN, done);
            });
        });

        it('it should fail login with incorrect password', (done) => {
            let firstUser = createUser();
            firstUser.enabled = true;
            firstUser.password = User.encodePassword(firstUser.password);

            firstUser.save((err, user) => {
                const loginData = {
                    email: 'peter.parker@pickandgol.com',
                    password: 'YourFriendAnd'
                };

                testLoginThatFails(loginData, HttpStatus.UNAUTHORIZED, done);
            });
        });

        it('it should fail login with a non existent user', (done) => {
            const loginData = createUser();
            testLoginThatFails(loginData, HttpStatus.NOT_FOUND, done);
        });

        function testLoginThatFails(loginData, errorCode, done) {
            chai.request(app)
                .post('/api/v1/users/login')
                .send(loginData)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.an('object');
                    res.body.should.have.property('result').equal('ERROR');
                    res.body.should.have.deep.property('data.code').equal(errorCode);

                    done();
                });
        }
    });

    function createUser() {
        return new User({
            email: 'peter.parker@pickandgol.com',
            name: 'Peter Parker',
            password: 'YourFriendAndNeighbour'
        });
    }
});