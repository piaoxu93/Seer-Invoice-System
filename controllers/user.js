var User = require('../proxy').User;
var utility = require('utility');
var util = require('util');

var tools = require('../common/tools');
var config = require('../config');

exports.index = function (req, res, next) {
  var user_name = req.params.name;
  User.getUserByLoginName(user_name, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render('notify/notify', {error: '这个用户不存在。'});
      return;
    }

    var render = function () {
      user.friendly_create_at = tools.formatDate(user.create_at, true);
      user.url = (function () {
        if (user.url && user.url.indexOf('http') !== 0) {
          return 'http://' + user.url;
        }
        return user.url;
      })();
      // 如果用户没有激活，那么管理员可以帮忙激活
      var token = '';
      if (!user.active && req.session.user && req.session.user.is_admin) {
        token = utility.md5(user.email + user.pass + config.session_secret);
      }
      res.render('user/index', {
        user: user,
        token: token,
        pageTitle: util.format('@%s 的个人主页', user.loginname),
      });
    };
    render();

  });
};