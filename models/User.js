const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
    Recents: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;