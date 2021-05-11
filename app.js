const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');


const app = express();

dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let gfs;

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connection Open!');
        const conn = mongoose.connection;

        gfs = Grid(conn.db, mongoose.mongo);

        console.log('Gridfs-mongo connection Open');
    })
    .catch((e) => {
        console.log('ERROR!');
        console.log(e);
    })

const songs = [

    {
        name: 'a',
        artist: 'aa'
    },
    {
        name: 'bb',
        artist: 'bb'
    },
    {
        name: 'c',
        artist: 'cc'
    },
    {
        name: 'd',
        artist: 'dd'
    }

]






app.get('/', (req, res) => {
    res.render('index', {songs});
});


app.get('/test', (req, res) => {
    res.render('test');
});

app.get('/audio/:filename', (req, res) => {

    console.log('Audio request recieved!');

   const readstream = gfs.createReadStream({filename: req.params.filename})

    console.log(`Girdfs readstream created with ${req.params.filename}`);
    
   readstream.on('error', (error) => {
        res.sendStatus(500)
   })
   res.type('audio/mpeg');
   readstream.pipe(res)
});



PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`APP is listening on Port ${PORT}`);
})