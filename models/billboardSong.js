let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let billboardSongSchema = new Schema({
    'rank': Number,
    'artist': String,
    'title': String,
    'videoId': String
});

module.exports = mongoose.model('billboardSong', billboardSongSchema);