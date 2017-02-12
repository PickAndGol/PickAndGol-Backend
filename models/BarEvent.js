let mongoose = require('mongoose');

let BarEventSchema = mongoose.Schema({
    bar_id: {
        type: String,
        required: true,
        index: true
    },
    event_id: {
        type: String,
        required: true,
        index: true
    }
});

let BarEvent = mongoose.model('BarEvent', BarEventSchema);

BarEventSchema.statics.saveBarEvent = function(newBarEvent, callback) {
    let barEvent = new BarEvent(newBarEvent);

    barEvent.save(function(err, barEvent) {
        if (err) {
            return callback(err);
        }

        return callback(null, barEvent);
    });
};