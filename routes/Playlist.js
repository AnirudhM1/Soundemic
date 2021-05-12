const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Routes to /users/:id/playlists

router.get('/:id/playlists', async (req, res) => {
    const user = await User.findById(req.params.id).populate('Playlist');
    if(user.playlists) {
        res.send(user.playlists);
    }
    else {
        res.send([]);
    }
})

router.post('/:id/playlists', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const title = req.body.title || 'unnamed';
        console.log(title);
        const playlist = new Playlist({ title });
        user.playlists.push(playlist);
        playlist.save();
        user.save();
        res.send(playlist);
    } catch(e) {
        res.send(e);
    }
})

router.get('/:id/playlists/:playlistId', async (req, res) => {
    const playlist = await Playlist.findById(req.params.playlistId);
    res.send(playlist);
})

router.delete('/:id/playlists/:playlistId', async (req, res) => {
    const {id, playlistId} = req.params;
    await User.findOneAndUpdate(id, { $pull: { playlists: playlistId } });
    await Playlist.findByIdAndDelete(playlistId);
    res.send('Deleted!');
})

module.exports = router;