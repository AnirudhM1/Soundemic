const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    length: Number
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;