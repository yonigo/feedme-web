var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    type: String,
    orderDate: Date,
    supplyDate: Date,
    status: String,
    product: String,
    quantity: Number,
    package: String,
    supplierId: String,
    reciverId: String
});

var order = mongoose.model('order', orderSchema);

function getById(id) {
    return order.findById(id);
}

function getOneBySupplierId(supplierId) {
    return  order.findOne({ supplierId });
}   

function getAllBySupplierId(supplierId) {
    return order.find({ supplierId });
}

function getOneByReciverId(reciverId) {
    return order.findOne({ reciverId });
}

function getAllByReciverId(reciverId) {
    return order.find({ reciverId });
}

function getByReciverIdAndSupplierId(supplierId, reciverId) {
    return order.find({ supplierId, reciverId });
}

module.exports = {
    getById: getById,
    getOneBySupplierId: getOneBySupplierId,
    getAllBySupplierId: getAllBySupplierId,
    getOneByReciverId: getOneByReciverId,
    getAllByReciverId: getAllByReciverId,
    getByReciverIdAndSupplierId: getByReciverIdAndSupplierId
};