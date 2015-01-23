var models = require('../models');
var Invoice = models.Invoice;

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var invoice = new Invoice();
  invoice.name = obj.name;
  invoice.projectName = obj.projectName;
  invoice.department = obj.department;
  invoice.itemName = obj.itemName;
  invoice.brand = obj.brand;
  invoice.model = obj.model;
  invoice.unitPrice = obj.unitPrice;
  invoice.quantity = obj.quantity;
  invoice.total = obj.total;
  invoice.requisitioner = obj.requisitioner;
  invoice.date = new Date(obj.dateStr);
  invoice.payMethod = obj.payMethod;
  invoice.arrivalDate = new Date(obj.arrivalDateStr);
  invoice.invoiceType = obj.invoiceType;
  invoice.detail = obj.detail;
  invoice.note = obj.note;

  invoice.save(callback);
};

exports.getInvoicesByName = function (name, opt, callback) {
  Invoice.find({ name: name }, '_id itemName projectName createDate progress',
               opt, callback);
};

exports.getInvoiceById = function (id, callback) {
  Invoice.findById(id, callback);
};

exports.getInvoices = function (opt, callback) {
  Invoice.find({}, '_id name itemName projectName createDate progress',
               opt, callback);
};

exports.findByIdAndUpdateProgress = function (id, progress, callback) {
  Invoice.findByIdAndUpdate(id, { $set: { progress: progress } }, callback);
}

exports.findByIdAndDeleteInvoice = function (id, callback) {
  Invoice.findByIdAndRemove(id, callback);
}