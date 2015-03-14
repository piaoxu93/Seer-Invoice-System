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

exports.getData = function (req, res, next) {
  var param = req.body;
  var beginDate = param.beginDate;
  var endDate = param.endDate;
  var ep = new EventProxy();
  ep.all('cash', 'travel', function (cash, travel) {
  	res.status(200);
  	res.json({ cash: cash, travel: travel, beginDate: beginDate, endDate: endDate});
  });

  CashInvoice.getInvoicesByDate(beginDate, endDate, {sort: 'createDate'},
  	function (err, invoices) {
  	  if (err) {
  	  	return next(err);
  	  }
  	  ep.emit('cash', invoices);
  	});
  TravelInvoice.getInvoicesByDate(beginDate, endDate, {sort: 'createDate'},
  	function (err, invoices) {
  	  if (err) {
  	    return next(err);
  	  }
  	  ep.emit('travel', invoices);
  	});
};