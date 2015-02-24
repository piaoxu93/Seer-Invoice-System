var mongoose = require('mongoose');
var config   = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./cashinvoice');
require('./item');
require('./travelinvoice');
require('./ticket');
require('./hotel');
require('./meal');

exports.User          = mongoose.model('User');
exports.CashInvoice   = mongoose.model('CashInvoice');
exports.Item          = mongoose.model('Item');
exports.TravelInvoice = mongoose.model('TravelInvoice');
exports.Ticket        = mongoose.model('Ticket');
exports.Hotel         = mongoose.model('Hotel');
exports.Meal          = mongoose.model('Meal');
