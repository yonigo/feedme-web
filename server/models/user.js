var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

function login(username, password) {
    return User.findOne({ username, password });
}

module.exports = {
    login: login
}