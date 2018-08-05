const express = require('express')
const app = express();
const path = require('path')
const users = require('./server/routes/users');
const orders = require('./server/routes/orders');
const products = require('./server/routes/products');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var allowControlAccessMiddleware = require('./server/middlewares/allowControlAccess');


// mongoose setup
const MONGOURI = process.env.MONGOURI || 'someback-upaddress';
// this .env file should be added to .gitignore since it contains passwords
mongoose.connect( MONGOURI, {useMongoClient: true})
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static("public"));
app.use(cookieParser('test'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(allowControlAccessMiddleware);

app.use('/',express.static(path.join(__dirname, 'dist'))); // angular project
app.use('/users', users);
app.use('/orders', orders);
app.use('/products', products);

const port = process.env.PORT || 3000; // PORT is another variable that can be placed in the .env file
app.listen(port, function(){
  console.log('Example app listening on port ' + port +'!')
})
