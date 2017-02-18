/**
 * Created by Antonio on 4/2/17.
 */
'use strict';

var mongoose = require('mongoose');

var conn = mongoose.connection;

// Handles de events de conexion

conn.on('error', console.log.bind(console, 'Connection error'));

conn.once('open',function (){
    console.log('Connected to mongodb');
});

// mpromise is deprecated, so use ES6 Promises instead
mongoose.Promise = Promise;

// Connect to pickandgol database
mongoose.connect('mongodb://localhost:27017/pickandgol');