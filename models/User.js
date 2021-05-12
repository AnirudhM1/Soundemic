const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
    Recents: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;