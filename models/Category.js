'use strict';

let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:true
    }
});

categorySchema.statics.list = function(callback) {
    return Category.find().exec(callback);
};

categorySchema.statics.total = function(callback) {
    return Category.find().count().exec(callback);
};

let Category = mongoose.model('Category', categorySchema);