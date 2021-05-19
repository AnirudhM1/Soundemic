const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

router.get('/', (req, res) => {
    res.render('Search', { songs: [] });
})

router.post('/', async (req, res) => {
    try {
        const song = await Song.findOne({name: req.body.search});
        if(song) {
            const artist = song.artist;
            const SONGS_BY_ARTISTS = await Song.find({artist: artist});
            res.render('Search', { songs: [song].concat(SONGS_BY_ARTISTS) });
        }
        else {
            const SIMILAR_SONGS = await Song.findSimilarSongs(req.body.search);
            res.render('Search', { songs: SIMILAR_SONGS })
        }
    } catch(e) {
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
        _id: 'song',
        name: 'Lateralus',
        artist: 'Tool',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Tool_-_Lateralus.jpg'
    },
    {
        _id: 'song2',
        name: 'New Divide',
        artist: 'Linkin Park',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/b/b1/New_Divide_%28Linkin_Park_single_-_cover_art%29.jpg'
    },
    {
        _id: 'song',
        name: 'song3',
        artist: 'artist3',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Tool_-_Lateralus.jpg'
    },
    {
        _id: 'song2',
        name: 'song4',
        artist: 'artist4',
        img_url: 'https://upload.wikimedia.org/wikipedia/en/b/b1/New_Divide_%28Linkin_Park_single_-_cover_art%29.jpg'
    }

]