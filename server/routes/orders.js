var express = require('express');
var passport = require('passport');
var Order = require('../models/order');
var authenticationMiddleware = require('../middlewares/authentication');

var router = express.Router();

router.route('/')
    .get(authenticationMiddleware(),
    function(req, res) {
        Order.getAll()
        .then(function(orders) {
            res.send(orders);
        })
    }
);

router.route('/')
    .post(//authenticationMiddleware(),
    function(req, res) {
        Order.create(req.body.data)
        .then(function(data) {
            res.send(data);
        })
    }
);

router.route('/supplier/:id')
    .get(authenticationMiddleware(),
    function(req, res) {
        Order.getAllBySupplierId(req.params.id)
        .then(function(orders) {
            res.send(orders);
        })
    }
);

router.route('/reciver/:id')
    .get(authenticationMiddleware(),
    function(req, res) {
        Order.getAllByReciverId(req.params.id)
        .then(function(orders) {
            res.send(orders);
        })
    }
);

module.exports = router;