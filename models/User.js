const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Playlist = require('./Playlist');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true,
        unique: [true, 'username already selected']
    },
    password: { // Saves the hashed password with salt
        type: String, 
        required: true
    },
    email: String,
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist', required: true}],
    Recents: [{type: Schema.Types.ObjectId, ref: 'Song', required: true}]
});

userSchema.statics.findAndValidate = async function(username, password) {
    const user = await User.findOne({ username });
    if(!user) {
        return false
    }
    const isValid = await bcrypt.compare(password, user.password);
    return (isValid) ? user : false;
}

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.post('findOneAndDelete', async function(user) {
    if(user.playlists.length) {
        await Playlist.deleteMany({ _id: { $in: user.playlists } })
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;