var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');

router.route('/')
    .get(function(req, res) {
        Product.getAll()
        .then(function(products) {
            res.send(products);
        });
    }
);

router.route('/:id')
    .get(function(req, res) {
        Product.getById(req.params.id)
        .then(function(products) {
            res.send(products);
        });
    }
);

module.exports = router;