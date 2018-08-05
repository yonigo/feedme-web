var express = require('express');
var router = express.Router();
var passport = require('passport');
var ProductType = require('../models/productType');

router.route('/')
    .get(passport.authenticate('local'),
    function(req, res) {
        var productTypes = ProductType.getAll();

        res.send(productTypes);
    }
);

module.exports = router;