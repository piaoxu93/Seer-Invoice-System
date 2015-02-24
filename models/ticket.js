var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
  flights: { type: String, required: true }, // 车次/航班
  departure: { type: String, required: true }, // 出发地
  destination: { type: String, required: true }, // 目的地
  date: { type: Date, required: true }, // 航班出发时间
  person: { type: String, required: true }, // 乘客姓名
  price: {
    type: Number,
    default: 0.0,
    required: true,
    min: 0
  }, // 单价
  createDate: { type: Date, default: Date.now, required: true},
  note: { type: String } // 备注
});

mongoose.model('Ticket', TicketSchema);