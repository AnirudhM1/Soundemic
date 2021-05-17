const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');


router.get('/register', (req, res) => { //To register user
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.post('/', async (req, res) => {
    try {
        const {email, Firstname, Lastname/* , username */, password} = req.body;
        const name = `${Firstname} ${Lastname}`;
        const username = `${Firstname}_${Lastname}`; // This is temp username. Actual username to be used will be imported from the form
        const user = new User({name, email, username, password});
        await user.save();
        res.send('User created!');

    } catch(e) {
        console.log(e);
    }
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => { // To login user
    const {username, password} = req.body;
    const user = await User.findAndValidate(username, password);
    if(user) {
        req.session.user_id = user._id;
        res.send('Logged in!');
    }
    else {
        res.send('Invalid username or password');
    }
})

router.get('/logout', (req, res) => { // This is set to get for debugging purposes and needs to be changed to post
    req.session.destroy();
    res.redirect('/users/login')
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate('Playlist') || false;
    res.render('profile', user);
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const data = await User.findOneAndDelete({ _id: id});
    res.send(data);
})

module.exports = router;