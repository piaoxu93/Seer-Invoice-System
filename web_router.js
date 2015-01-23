/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var topic = require('./controllers/topic');
var invoice = require('./controllers/invoice');
var staticController = require('./controllers/static');
var auth = require('./middlewares/auth');
var passport = require('passport');
var config = require('./config');

var router = express.Router();

// home page
router.get('/', auth.userRequired, site.index);

// invoice controller
router.get('/submit', auth.userRequired, invoice.showSubmit);
router.post('/submit', auth.userRequired, invoice.submit, invoice.submitError);
router.get('/myinvoice', auth.userRequired, invoice.showUserInvoice);
router.get('/invoice/:id', auth.userRequired, invoice.showInvoice);
router.get('/invoices', auth.adminRequired, invoice.showAllInvoice);
router.post('/invoice/:id', auth.adminRequired, invoice.changeProgress);

// sign controller
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验

router.post('/upload', auth.userRequired, topic.upload); //上传图片

// static
router.get('/about', auth.userRequired, staticController.about);
router.get('/robots.txt', staticController.robots);

module.exports = router;
