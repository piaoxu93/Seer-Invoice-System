var validator = require('validator');
var config = require('../config');
var tools = require('../common/tools');
var TravelInvoice = require('../proxy').TravelInvoice;
var Ticket = require('../proxy').Ticket;
var Hotel = require('../proxy').Hotel;
var Meal = require('../proxy').Meal;
var User = require('../proxy').User;
var mail = require('../common/mail');
var xss = require('xss');

exports.showSubmitTravel = function (req, res, next) {
  res.render('submit/travel', {
    department: config.department,
    projects: config.projects
  });
};