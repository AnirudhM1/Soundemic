const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const User = require('../models/User');

router.get('/', async (req, res) => {
    const user_id = (req.session.user_id) ? req.session.user_id : "guest";
    res.render('Search', { user_id, playlists: [], songs: [] });
})

router.post('/', async (req, res) => {
    try {
        const user_id = (req.session.user_id) ? req.session.user_id : "guest";
        let playlists = [];
        if (user_id !== "guest") {
            const user = await User.findById(user_id).populate('playlists');
            if (user.playlists) {
                playlists = user.playlists;
            }
        }
        const song = await Song.findOne({ name: req.body.search });
        if (song) {
            const artist = song.artist;
            const SONGS_BY_ARTISTS = await Song.find({ artist: artist });
            res.render('Search', { songs: [song].concat(SONGS_BY_ARTISTS) });
        }
        else {
            const SIMILAR_SONGS = await Song.findSimilarSongs(req.body.search);
            res.render('Search', { user_id, playlists, songs: SIMILAR_SONGS })
        }
    } catch (e) {
        console.error(e);
    }
})

router.get('/all', async (req, res) => {
    const allSongs = await Song.find({});
    res.send(allSongs);
})

// For testing

router.get('/test', (req, res) => {
    res.render('playlist', { songs });
})

module.exports = router;

const songs = [

    {
        _id: 'song1',
        title: 'Lateralus',
        artist: 'Tool',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Tool_-_Lateralus.jpg'
    },
    {
        _id: 'song2',
        title: 'New Divide',
        artist: 'Linkin Park',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/b/b1/New_Divide_%28Linkin_Park_single_-_cover_art%29.jpg'
    },
    {
        _id: 'song3',
        title: 'song3',
        artist: 'artist3',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Tool_-_Lateralus.jpg'
    },
    {
        _id: 'song4',
        title: 'song4',
        artist: 'artist4',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/b/b1/New_Divide_%28Linkin_Park_single_-_cover_art%29.jpg'
    }

]