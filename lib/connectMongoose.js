/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

let mongoose = require('mongoose');
let config = require('config');

let conn = mongoose.connection;

// Handles de events de conexion

conn.on('error', console.log.bind(console, 'Connection error'));

if (config.util.getEnv('NODE_ENV') !== 'test') {
    conn.once('open', function() {
        console.log('Connected to mongodb on: ' + config.DBUrl);
    });
}

// mpromise is deprecated, so use ES6 Promises instead
mongoose.Promise = Promise;

// Connect to pickandgol database
mongoose.connect(config.DBUrl);