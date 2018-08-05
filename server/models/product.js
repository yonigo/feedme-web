var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    name: String,
    imageURL: String,
    leketId: String
});

var product = mongoose.model('products', productSchema);

function getAll() {
    return product.find();
}

function getById(id) {
    return product.findById(id);
}

function getByName(name) {
    return product.findOne({ name });
}

function getByIds(ids) {
    var objectIds = ids.map(function(id) {
        return mongoose.Types.ObjectId(id)
    });

    return product.find({
        _id: {
            $in : objectIds
        }
    });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    getByName: getByName,
    getByIds: getByIds
};