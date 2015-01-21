/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */

var config = require('./config');

var path = require('path');
var Loader = require('loader');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./models');
var webRouter = require('./web_router');
var auth = require('./middlewares/auth');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

// assets
var assets = {};
if (config.mini_assets) {
  try {
    assets = require('./assets.json');
  } catch (e) {
    console.log('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new MongoStore({
    url: config.db
  }),
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());

// custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());

app.use(Loader.less(__dirname));
app.use('/public', express.static(staticDir));

app.use(function (req, res, next) {
  if (req.path.indexOf('/api') === -1) {
    csurf()(req, res, next);
    return;
  }
  next();
});

// set static, dynamic helpers
_.extend(app.locals, {
  config: config,
  Loader: Loader,
  assets: assets
});

app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

app.use(busboy({
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB
  }
}));

// routes
app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    return res.status(500).send('500 status, 内部错误, 请联系管理员');
  });
}

app.listen(config.port, function () {
  console.log("FIS listening on port %d in %s mode", config.port, app.settings.env);
});


module.exports = app;
