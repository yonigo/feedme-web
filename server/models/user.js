var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    username: String,
    password: String,
    type: String,
    details: Object,
    chromeToken: String,
    gcmToken: String
});

var User = mongoose.model('User', userSchema);

function login(username, password) {
    return User.findOne({ username, password });
}

function update(data) {
    return User.findOneAndUpdate(data.query, {$set: data.set});
}

function getById(id) {
    return User.findById(id);
}

function getAll() {
    return User.find({});
}

module.exports = {
    login: login,
    getById: getById,
    update: update,
    getAll: getAll
}