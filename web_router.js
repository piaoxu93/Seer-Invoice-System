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
var cashInvoice = require('./controllers/cashinvoice');
var travelInvoice = require('./controllers/travelinvoice');
var staticController = require('./controllers/static');
var auth = require('./middlewares/auth');
var passport = require('passport');
var config = require('./config');

var router = express.Router();

// home page
router.get('/', auth.userRequired, site.index);

router.get('/submit/choose', auth.userRequired, site.choose);

// cash invoice controller
router.get('/submit/cash', auth.userRequired, cashInvoice.showSubmitCash);
router.post('/submit/cash', auth.userRequired, cashInvoice.submitCash, cashInvoice.submitError);
router.get('/mycashinvoices/:page', auth.userRequired, cashInvoice.showUserInvoice);
router.get('/cashinvoices/:page', auth.adminRequired, cashInvoice.showAllInvoice);
router.get('/cashinvoice/id/:id', auth.userRequired, cashInvoice.showInvoice);
router.post('/cashinvoice/id/:id', auth.adminRequired, cashInvoice.changeProgress);
router.post('/cashinvoice/delete', auth.adminRequired, cashInvoice.deleteInvoice);

// travel invoice controller
router.get('/submit/travel', auth.userRequired, travelInvoice.showSubmitTravel);
router.post('/submit/travel', auth.userRequired, travelInvoice.submitTravel, travelInvoice.submitError);
router.get('/mytravelinvoices/:page', auth.userRequired, travelInvoice.showUserInvoice);
router.get('/travelinvoices/:page', auth.adminRequired, travelInvoice.showAllInvoice);
router.get('/travelinvoice/id/:id', auth.userRequired, travelInvoice.showInvoice);
router.post('/travelinvoice/id/:id', auth.adminRequired, travelInvoice.changeProgress);
router.post('/travelinvoice/delete', auth.adminRequired, travelInvoice.deleteInvoice);

// sign controller
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);     // 登录校验

router.post('/upload', auth.userRequired, topic.upload); //上传图片

// static
router.get('/about', auth.userRequired, staticController.about);
router.get('/robots.txt', staticController.robots);

module.exports = router;
