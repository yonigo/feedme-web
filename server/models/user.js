var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    username: String,
    password: String,
    type: String,
    details: Object
});

var User = mongoose.model('User', userSchema);

function login(username, password) {
    return User.findOne({ username, password });
}

function getById(id) {
    return User.findById(id);
}

module.exports = {
    login: login,
    getById: getById
}