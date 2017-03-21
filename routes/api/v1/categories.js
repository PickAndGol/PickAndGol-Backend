'use strict';

let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
require('../../../models/Category');
let Category = mongoose.model('Category');

/**
 * GET /categories
 *
 * Return events categories
 */
router.get('/', function(req, res) {
    const listPromise = Category.list();
    const totalPromise = Category.total();
    const promises = [listPromise, totalPromise];

    Promise.all(promises)
        .then(([categories, total]) => {
            return res.json({
                "result": "OK",
                "data": {
                    "total": total,
                    "items": categories
                }
            });
        })
        .catch((error) => {
            return res.json({
                "result": "ERROR",
                "data": {
                    "code": 400,
                    "description": "Bad request."
                }
            });
        });
});

module.exports = router;