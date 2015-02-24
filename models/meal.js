var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MealSchema = new Schema({
  restaurant: { type: String, required: true }, // 饭店名称
  address: { type: String, required: true }, // 地址
  date: { type: Date, required: true }, // 时间
  person: { type: String, require: true }, // 就餐人员
  price: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 价格
  createDate: { type: Date, default: Date.now, required: true},
  note: { type: String } // 备注
});

mongoose.model('Meal', MealSchema);