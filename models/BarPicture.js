"use strict";

let mongoose = require('mongoose');

let BarPictureSchema = mongoose.Schema({
    bar_id: {
        type: String,
        required: true,
        index: true
    },
    photo_url: {
        type: String,
        required: true
    }
});

BarPictureSchema.statics.list = function(id, callback) {
    barPicture.find({ bar_id: id }, function(err, barPictures) {
        if (err) {
            if (callback != null) {
                callback(err);
                return;
            }
        }

        let pictures = [];
        for (let index in barPictures) {
            if (barPictures.hasOwnProperty(index)) {
                pictures[index] = barPictures[index].photo_url;
            }
        }

        return callback(null, pictures);
    });
};

let barPicture = mongoose.model('barPicture', BarPictureSchema);