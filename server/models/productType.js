var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productTypeSchema = new Schema({
    id: String,
    name: String,
    weightUnit: String
});

var productType = mongoose.model('productType', productTypeSchema);

function getAll() {
    return productType.find();
}

function getById(id) {
    return productType.findOne({ id });
}

function getByName(name) {
    return productType.findOne({ name });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    getByName, getByName
};