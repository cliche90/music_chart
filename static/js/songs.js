let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let chartScheme = new Schema({
    'rank': Number,
    'artist': String,
    'title': String,
    'url': String
});

module.exports = mongoose.model('song', chartScheme);
