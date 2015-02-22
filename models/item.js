var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  ItemName: { type: String, required: true },
  brand: { type: String, required: true }, // 品牌
  model: { type: String, required: true }, // 规格型号
  unitPrice: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 单价
  quantity: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  } // 数量
});

ItemSchema.virtual('totalPrice').get(function () {
  // 返回Item的总结,单价*数量
  return this.unitPrice * this.quantity;
});

mongoose.model('Item', CashInvoiceSchema);