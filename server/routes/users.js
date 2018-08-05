var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.login(username, password)
            .then(function(user) {
                if (user.errors) { 
                    return done(err); 
                }
                else {
                    return done(null, user);
                }
            });
        })
    );

passport.serializeUser(function(user, done) {
    done(null, user);
});
      
passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.route('/login')
    .post(passport.authenticate('local'),
    function(req, res) {
        res.sendStatus(200);
    }
);

module.exports = router;