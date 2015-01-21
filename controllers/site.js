/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var User = require('../proxy').User;
var config = require('../config');
var tools = require('../common/tools');

exports.index = function (req, res, next) {
  res.render('index');
};

exports.showSubmit = function (req, res, next) {
  res.render('submit');
};

exports.submit = function (req, res, next) {
  console.log(req.body);
  res.render('submitsuccess', req.body);
};