/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var config = require('../config');

exports.index = function (req, res, next) {
  res.render('index', {
    informs: config.informs
  });
};