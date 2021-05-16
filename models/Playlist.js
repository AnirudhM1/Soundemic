const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    songs: [{type: Schema.Types.ObjectId, ref: 'Song', required: true}]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;