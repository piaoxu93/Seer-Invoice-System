var config = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CashInvoiceSchema = new Schema({
  name: { type: String, required: true }, // 填表人
  projectName: { type: String, required: true }, // 项目名称
  department: {
    type: String,
    required: true,
    enum: config.department
  }, // 费用支出部门
  itemId: { type: Array, required: true }, // 保存item的索引Id
  totalPrice: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 总价
  requisitioner: { type: String, required: true }, // 申购人
  date: { type: Date, required: true }, // 申购日期
  payMethod: {
    type: String,
    default: '信用卡',
    required: true,
    enum: config.payMethod
  }, // 付款方式
  arrivalDate: { type: Date, required: true }, // 到货日期
  invoiceType: {
    type: String,
    default: '普通发票',
    required: true,
    enum: config.invoiceType
  }, // 发票类别
  detail: { type: String }, // 供应商明细
  note: { type: String }, // 备注
  createDate : { type: Date, default: Date.now, required: true},
  progress: {
    type: String,
    default: '未处理',
    required: true,
    enum: config.progress
  } // 报销进度
});

mongoose.model('CashInvoice', CashInvoiceSchema);