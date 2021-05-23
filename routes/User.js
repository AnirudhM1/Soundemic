const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');


router.get('/register', (req, res) => { //To register user
    res.render('signup');
});

router.get('/', async (req, res) => {
    const id = req.session.user_id;
    const user = await User.findById(id).populate('playlists') || false;
    const username = user.username || "unnamed";
    res.render('profile', {
        user_id: id,
        username,
        playlists: user.playlists
    });
})

router.post('/', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const user = new User({ name, username, password });
        await user.save();
        req.session.user_id = user._id;
        res.redirect('/users')

    } catch (e) {
        req.flash('warning', 'Username already taken');
        res.redirect('/users/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => { // To login user
    try {
        const { username, password } = req.body;
        const user = await User.findAndValidate(username, password);
        if (user) {
            req.session.user_id = user._id;
            res.redirect('/users');
        }
        else {
            req.flash('warning', 'Invalid username or password')
            res.redirect('/users/login');
        }
    } catch (e) {
        console.error(e);
    }
})

router.get('/logout', (req, res) => { // This is set to get for debugging purposes and needs to be changed to post
    req.session.destroy();
    res.redirect('/users/login')
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findOneAndDelete({ _id: id });
        res.send(data);
    } catch (e) {
        console.error(e);
    }

})

module.exports = router;