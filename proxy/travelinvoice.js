var models = require('../models');
var TravelInvoice = models.TravelInvoice;

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var invoice = new TravelInvoice();
  invoice.name = obj.name;
  invoice.projectName = obj.projectName;
  invoice.department = obj.department;
  invoice.ticketId = obj.ticketId;
  invoice.hotelId = obj.hotelId;
  invoice.mealId = obj.mealId;
  invoice.totalPrice = obj.totalPrice;

  invoice.save(callback);
};

exports.getInvoicesByName = function (name, opt, callback) {
  TravelInvoice.find({ name: name }, '_id projectName totalPrice createDate progress',
               opt, callback);
};

exports.getInvoiceById = function (id, callback) {
  TravelInvoice.findById(id, callback);
};

exports.getInvoices = function (opt, callback) {
  TravelInvoice.find({}, '_id name projectName totalPrice createDate progress',
               opt, callback);
};

exports.getInvoicesByDate = function (beginDate, endDate, opt, callback) {
  var beginDate = beginDate;
  var endDate = endDate;
  TravelInvoice.find({createDate: {$gte: beginDate, $lte: endDate}, progress: '已完成'}, '_id name projectName totalPrice createDate', opt, callback);
}

exports.getInvoicesByDateAndName = function (beginDate, endDate, name, opt, callback) {
  var beginDate = beginDate;
  var endDate = endDate;
  TravelInvoice.find({createDate: {$gte: beginDate, $lte: endDate}, progress: '已完成', name: name}, '_id name projectName totalPrice createDate', opt, callback);
}

exports.findByIdAndUpdateProgress = function (id, progress, callback) {
  TravelInvoice.findByIdAndUpdate(id, { $set: { progress: progress } }, callback);
}

exports.findByIdAndDeleteInvoice = function (id, callback) {
  TravelInvoice.findByIdAndRemove(id, callback);
}