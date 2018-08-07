var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    type: String,
    orderDate: Date,
    pickupDate: Date,
    expirationDate: Date,
    status: String,
    product: String,
    quantity: Number,
    package: String,
    supplier: { type: Schema.Types.ObjectId, ref: 'User' },
    reciver: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Order = mongoose.model('order', orderSchema);

function getById(id) {
    return Order.findById(id).populate('supplier');
}

function getAll() {
    return Order.find({}).populate('supplier');
}

function getOneBySupplierId(supplierId) {
    return Order.findOne({ supplierId });
}

function getAllBySupplierId(supplierId) {
    return Order.find({ "supplier": supplierId });
}

function getOneByReciverId(reciverId) {
    return Order.findOne({ reciverId });
}

function getAllByReciverId(reciverId) {
    return Order.find({ reciverId });
}

function getByReciverIdAndSupplierId(supplierId, reciverId) {
    return Order.find({ supplierId, reciverId });
}

function create(data) {
    var order = new Order(data);

    return order.save();
}

function update(data) {
    return Order.findOneAndUpdate(data.query, {$set: data.set});
}

module.exports = {
    getById: getById,
    getOneBySupplierId: getOneBySupplierId,
    getAllBySupplierId: getAllBySupplierId,
    getOneByReciverId: getOneByReciverId,
    getAllByReciverId: getAllByReciverId,
    getByReciverIdAndSupplierId: getByReciverIdAndSupplierId,
    create: create,
    getAll: getAll,
    update: update
};