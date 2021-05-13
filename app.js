const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const testRoutes = require('./routes/Test'); // These are routes used for testing
const userRoutes = require('./routes/User');
const playlistRoutes = require('./routes/Playlist');


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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res) => {
    res.render('index', {songs});
});

app.use('/users', userRoutes);
app.use('/users', playlistRoutes);
app.use('/test', testRoutes);

// Route to stream music

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