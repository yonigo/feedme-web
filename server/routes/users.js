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
    .post(passport.authenticate('local', {session: true}),
    function(req, res) {
        var userDetails = {
            id: req.user._id,
            username: req.user.username,
            type: req.user.type,
            details: req.user.details
        };

        res.send(userDetails);
    }
);

router.route('/registerChromePush')
    .post(//passport.authenticate('local', {session: true}),
    function(req, res) {

        User.update({query: {username: req.body.username}, set: {chromeToken: req.body.chromeToken}}).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.send(err);
        })
    }
);

router.route('/registerAndroidPush')
    .post(//passport.authenticate('local', {session: true}),
    function(req, res) {

        User.update({query: {username: req.body.username}, set: {chromeToken: req.body.gcmToken}}).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.send(err);
        })
    }
);

module.exports = router;