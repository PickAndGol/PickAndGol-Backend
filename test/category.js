'use strict';

process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
require('../models/Category');
let Category = mongoose.model('Category');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Categories', () => {
    beforeEach((done) => {
        Category.remove({}, (err) => {
            done();
        });
    });

    describe('GET /api/v1/categories', () => {
        it('it should GET an empty array of items of an empty categories collection', (done) => {
            chai.request(app)
                .get('/api/v1/categories')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('result').and.equal('OK');
                    res.body.should.have.deep.property('data.total').and.equal(0);
                    res.body.should.have.deep.property('data.items')
                        .that.is.an('array')
                        .that.deep.equals([]);
                    done();
                });
        });

        it('it should GET all the categories', (done) => {
            let categoryNames = ['soccer', 'basketball'];
            categoryNames.forEach((categoryName) => {
                let category = new Category({ name: categoryName });
                category.save();
            });

            chai.request(app)
                .get('/api/v1/categories')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('result').and.equal('OK');
                    res.body.should.have.deep.property('data.total').and.equal(2);
                    res.body.should.have.deep.property('data.items')
                        .that.is.an('array');
                    done()
                });
        });
    });
});