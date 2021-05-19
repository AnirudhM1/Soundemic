const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Routes to /users

router.get('/:id/playlists', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('playlists');
        if(user.playlists) {
            res.send(user);
        }
        else {
            res.send([]);
        }
    } catch(e) {
        console.error(error);
    } 
})

router.post('/:id/playlists', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(req.body);
        const title = req.body.title || 'unnamed';
        console.log(title);
        const playlist = new Playlist({ title });
        user.playlists.push(playlist);
        playlist.save();
        user.save();
        res.redirect('/search');
    } catch(e) {
        console.log(e);
    }
})

router.get('/:id/playlists/:playlistId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        res.send(playlist);
    } catch(e) {
        console.error(e);
    }
})

router.delete('/:id/playlists/:playlistId', async (req, res) => {
    try {
        const {id, playlistId} = req.params;
        await User.findOneAndUpdate(id, { $pull: { playlists: playlistId } });
        await Playlist.findByIdAndDelete(playlistId);
        res.send('Deleted!');
    } catch(e)  {
        console.error(e);
    }
    
})

module.exports = router;