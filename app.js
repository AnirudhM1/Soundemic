const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const User = require('./models/User');

const testRoutes = require('./routes/Test'); // These are routes used for testing
const userRoutes = require('./routes/User');
const playlistRoutes = require('./routes/Playlist');
const searchRoutes = require('./routes/Search');


const app = express();

dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



let gfs;

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('Mongoose Connection Open!');
        /* const conn = mongoose.connection;

        gfs = Grid(conn.db, mongoose.mongo);

        console.log('Gridfs-mongo connection Open'); */
    })
    .catch((e) => {
        console.log('ERROR!');
        console.log(e);
    })

    const songs = [

        {
            _id: '1',
            name: 'Lateralus',
            artist: 'Tool'
        },
        {
            _id: '2',
            name: 'New Divide',
            artist: 'Linkin Park'
        },
        {
            _id: '3',
            name: 'song3',
            artist: 'artist3'
        },
        {
            _id: '4',
            name: 'song4',
            artist: 'artist4'
        }
    
    ]


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({'extended': true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session(sessionConfig));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/mainpage.html'));
});

app.use('/users', userRoutes);
app.use('/users', playlistRoutes);
app.use('/search', searchRoutes);
app.use('/test', testRoutes);


// Route create for debugging only

app.get('/secret', (req, res) => { 
    if(req.session.user_id) {
        res.send('User is logged in!')
    }
    else {
        res.redirect('/users/login');
    }
})


// Route to stream music

/* app.get('/audio/:filename', (req, res) => {

   const readstream = gfs.createReadStream({filename: req.params.filename})
    
   readstream.on('error', (error) => {
        res.sendStatus(500)
   })
   res.type('audio/mpeg');
   readstream.pipe(res)
}); */



PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`APP is listening on Port ${PORT}`);
})