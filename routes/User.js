const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const User = require('../models/User');


router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.post('/register', async (req,res) => {
    try {
        const {email, Firstname, Lastname/*, username*/, password} = req.body;
        const name = `${Firstname} ${Lastname}`;
        console.log(name);
        const username = `${Firstname}_${Lastname}`; // This is temp username. Actual username to be used will be imported from the form
        const user = new User({name, email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log('User created!');
            console.log(registeredUser);
            res.redirect('/');
        })
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;