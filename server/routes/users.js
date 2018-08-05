var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.login(username, password)
            .then(function(user) {
                if (!user) { 
                    return done(null, null, { message: 'User not found' }); 
                }
                else {
                    return done(null, user);
                }
            });
        })
    );

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
      
passport.deserializeUser(function(user, done) {
    User.getById(user.id)
    .then(function(user) {
        done(null, user);
    });
});

router.route('/login')
    .post(passport.authenticate('local'),
    function(req, res) {
        var userDetails = {
            username: req.user.username,
            type: req.user.type,
            details: req.user.details
        };

        res.send(userDetails);
    }
);

module.exports = router;