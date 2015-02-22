var models = require('../models');
var CaseInvoice = models.CashInvoice;

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var invoice = new CaseInvoice();
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
  invoice.date = obj.date;
  invoice.payMethod = obj.payMethod;
  invoice.arrivalDate = obj.arrivalDate;
  invoice.invoiceType = obj.invoiceType;
  invoice.detail = obj.detail;
  invoice.note = obj.note;

  invoice.save(callback);
};

exports.getInvoicesByName = function (name, opt, callback) {
  CaseInvoice.find({ name: name }, '_id itemName projectName createDate progress',
               opt, callback);
};

exports.getInvoiceById = function (id, callback) {
  CaseInvoice.findById(id, callback);
};

exports.getInvoices = function (opt, callback) {
  CaseInvoice.find({}, '_id name itemName projectName createDate progress',
               opt, callback);
};

exports.findByIdAndUpdateProgress = function (id, progress, callback) {
  CaseInvoice.findByIdAndUpdate(id, { $set: { progress: progress } }, callback);
}

exports.findByIdAndDeleteInvoice = function (id, callback) {
  CaseInvoice.findByIdAndRemove(id, callback);
}