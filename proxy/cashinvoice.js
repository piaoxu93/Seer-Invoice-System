var models = require('../models');
var CashInvoice = models.CashInvoice;

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var invoice = new CashInvoice();
  invoice.name = obj.name;
  invoice.projectName = obj.projectName;
  invoice.department = obj.department;
  invoice.itemId = obj.itemId;
  invoice.totalPrice = obj.totalPrice;
  invoice.requisitioner = obj.requisitioner;
  invoice.date = obj.date;
  invoice.payMethod = obj.payMethod;
  invoice.arrivalDate = obj.arrivalDate;
  invoice.invoiceType = obj.invoiceType;
  invoice.detail = obj.detail;
  invoice.note = obj.note;

  invoice.save(callback);
};

exports.getInvoicesByName = function (name, opt, callback) {
  CashInvoice.find({ name: name }, '_id itemId projectName totalPrice createDate progress',
               opt, callback);
};

exports.getInvoiceById = function (id, callback) {
  CashInvoice.findById(id, callback);
};

exports.getInvoices = function (opt, callback) {
  CashInvoice.find({}, '_id name itemId projectName totalPrice createDate progress',
               opt, callback);
};

exports.findByIdAndUpdateProgress = function (id, progress, callback) {
  CashInvoice.findByIdAndUpdate(id, { $set: { progress: progress } }, callback);
}

exports.findByIdAndDeleteInvoice = function (id, callback) {
  CashInvoice.findByIdAndRemove(id, callback);
}