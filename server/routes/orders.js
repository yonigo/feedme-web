var express = require('express');
var passport = require('passport');
var Order = require('../models/order');
var authenticationMiddleware = require('../middlewares/authentication');
var User = require('../models/user');

var FCM = require('fcm-node')
    
var serverKey = require('../../key.json') //put the generated private key path here    

var fcm = new FCM(serverKey);

function sendMessageToUsers(tokens, order) {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: tokens,//'fMOv0mfRSlg:APA91bFHktwuwHf12AU2X8ajCaSh4Lp3UJ3THK4vuW1M8VEWp8sBiYYE_kpWWfjtz7Qw2QNBcGPNqPKAbYnK8XLyfwAIFLTe1-pZizVjQ6o17o0r2v-zr7j-EGhQbaUTRAwO4L-SQOEP', 
        
        notification: {
            title: 'New Order Created', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            order: order.id,
            my_another_key: 'my another value'
        }
      }
      
      fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
      })
}


var router = express.Router();

router.route('/')
    .get(function(req, res) {
        Order.getAll()
        .then(function(orders) {
            res.send(orders);
        }).catch(function(err) {
            res.send(err);
        })
    }
);

router.route('/')
    .post(function(req, res) {
        Order.create(req.body.data)
        .then(function(data) {
            var userTokens = []
            User.getAll().then((users) => {
                users.forEach((u => {
                    if (u.chromeToken)
                        userTokens.push(u.chromeToken);
                }));
                sendMessageToUsers(data);
                res.send(data);
            })
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

router.route('/:id')
    .get(function(req, res) {
        Order.getById(req.params.id)
        .then(function(orders) {
            res.send(orders);
        })
    }
);

module.exports = router;