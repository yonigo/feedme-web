var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');

router.route('/')
    .get(passport.authenticate('local'),
    function(req, res) {
        var products = Product.getAll();

        res.send(products);
    }
);

module.exports = router;