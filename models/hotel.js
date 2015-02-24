var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = new Schema({
  name: { type: String, required: true }, // 酒店名称
  address: { type: String, required: true }, // 地址
  checkInDate: { type: Date, required: true }, // 时间
  person: { type: String, require: true }, // 入住人员
  unitPrice: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 单价
  days: {
    type: Number,
    default: 0,
    required: true,
    min: 1
  }, // 天数
  createDate: { type: Date, default: Date.now, required: true},
  note: { type: String } // 备注
});

HotelSchema.virtual('totalPrice').get(function () {
  // 返回Item的总结,单价*数量
  return this.unitPrice * this.days;
});

mongoose.model('Hotel', HotelSchema);