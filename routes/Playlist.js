const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');

// Routes to /users

router.get('/:id/playlists', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('playlists');
        if(user.playlists) {
            res.send(user.playlists);
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
        const title = req.body.title || 'unnamed';
        const playlist = new Playlist({ title });
        user.playlists.push(playlist);
        await playlist.save();
        await user.save();
        res.redirect('/search');
    } catch(e) {
        console.error(e);
    }
})

router.get('/:id/playlists/:playlistId', async (req, res) => {
    try {
        if(!req.session.user_id || req.session.user_id !== req.params.id) {
            res.redirect('/users/login');
        }
        else {
            const playlist = await Playlist.findById(req.params.playlistId).populate('songs');
            res.render('playlist', { playlist })
        }    
    } catch(e) {
        console.error(e);
    }
})

router.post('/:id/playlists/:playlistId', async (req, res) => {
    try {
        if(!req.session.user_id || req.session.user_id !== req.params.id) {
            res.redirect('/users/login');
        }
        else {
            const playlist = await Playlist.findById(req.params.playlistId);
            console.log(`Found playlist = ${playlist}`)
            console.log(`Song_id=${req.body.song_id}`)
            const song = await Song.findById(req.body.song_id);
            console.log('Found song: ')
            console.log(song)
            playlist.songs.push(song);
            await playlist.save();
            res.send('Song added!!');
        }    
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