const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

//Root Route
router.get('/', (req, res) => {
    res.render('landing');
});

//AUTH ROUTES
//show register form
router.get('/register', (req, res) => {
    res.render('register');
});
//Sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
            //return res.render('register', {'error': err.message});   could be this way too.
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', `Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});

//LOGIN ROUTES
router.get('/login', (req, res) => {
    res.render('login');
});
//LOGIN logic
router.post('/login', passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login' }), (req, res) => {

});

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/');
});

module.exports = router;