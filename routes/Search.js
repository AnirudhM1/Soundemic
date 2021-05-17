const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('search', { songs });
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
        artist: 'Tool'
    },
    {
        _id: 'song2',
        name: 'New Divide',
        artist: 'Linkin Park'
    },
    {
        _id: 'song',
        name: 'song3',
        artist: 'artist3'
    },
    {
        _id: 'song2',
        name: 'song4',
        artist: 'artist4'
    }

]