var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    id: String,
    name: String,
    weightUnit: String
});

var product = mongoose.model('product', productSchema);

function getAll() {
    return product.find();
}

function getById(id) {
    return product.findOne({ id });
}

function getByName(name) {
    return product.findOne({ name });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    getByName, getByName
};