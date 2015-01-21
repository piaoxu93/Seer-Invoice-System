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
var user = require('./controllers/user');
var topic = require('./controllers/topic');
var staticController = require('./controllers/static');
var auth = require('./middlewares/auth');
var passport = require('passport');
var config = require('./config');

var router = express.Router();

// home page
router.get('/', auth.userRequired, site.index);
router.get('/submit', auth.userRequired, site.showSubmit);
router.post('/submit', auth.userRequired, site.submit);

// sign controller
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验

// user controller
router.get('/user/:name', user.index); // 用户个人主页

router.post('/upload', auth.userRequired, topic.upload); //上传图片

// static
router.get('/about', auth.userRequired, staticController.about);
router.get('/robots.txt', staticController.robots);

module.exports = router;
