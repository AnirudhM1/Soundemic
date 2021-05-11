const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const playlistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    Songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;