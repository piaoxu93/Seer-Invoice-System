var validator = require('validator');
var config = require('../config');
var tools = require('../common/tools');
var CashInvoice = require('../proxy').CashInvoice;
var Item = require('../proxy').Item;
var User = require('../proxy').User;
var TravelInvoice = require('../proxy').TravelInvoice;
var Ticket = require('../proxy').Ticket;
var Hotel = require('../proxy').Hotel;
var Meal = require('../proxy').Meal;
var mail = require('../common/mail');
var xss = require('xss');
var EventProxy = require('eventproxy');

exports.show = function (req, res, next) {
  res.render('invoice/printmonthly', {
  });
};