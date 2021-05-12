const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Playlist = require('./Playlist');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist', required: true}],
    Recents: [{type: Schema.Types.ObjectId, ref: 'Song', required: true}]
});

userSchema.plugin(passportLocalMongoose);

userSchema.post('findOneAndDelete', async function(user) {
    if(user.playlists.length) {
        await Playlist.deleteMany({ _id: { $in: user.playlists } })
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;