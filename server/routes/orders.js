var express = require('express');
var passport = require('passport');
var Order = require('../models/order');
var authenticationMiddleware = require('../middlewares/authentication');

var router = express.Router();

router.route('/')
    .get(function(req, res) {
        Order.getAll()
        .then(function(orders) {
            res.send(orders);
        })
    }
);

router.route('/')
    .post(function(req, res) {
        Order.create(req.body.data)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.send(err);
        })
    }
);

router.route('/supplier/:id')
    .get(function(req, res) {
        Order.getAllBySupplierId(req.params.id)
        .then(function(orders) {
            res.send(orders);
        })
    }
);

router.route('/reciver/:id')
    .get(function(req, res) {
        Order.getAllByReciverId(req.params.id)
        .then(function(orders) {
            res.send(orders);
        })
    }
);

module.exports = router;