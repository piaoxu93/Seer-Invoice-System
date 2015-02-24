var config = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravelInvoiceSchema = new Schema({
  name: { type: String, required: true }, // 填表人
  projectName: { type: String, required: true }, // 项目名称
  department: {
    type: String,
    required: true,
    enum: config.department
  }, // 费用支出部门
  ticketId: { type: Array, required: true }, // 保存ticket的索引Id
  hotelId: { type: Array, required: true },
  mealId: { type: Array, required: true },
  totalPrice: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 总价
  createDate: { type: Date, default: Date.now, required: true},
  progress: {
    type: String,
    default: '未处理',
    required: true,
    enum: config.progress
  } // 报销进度
});

mongoose.model('TravelInvoice', TravelInvoiceSchema);