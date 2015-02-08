var mailer = require('nodemailer');
var config = require('../config');
var util = require('util');

var transport = mailer.createTransport('SMTP', config.mail_opts);
var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  if (config.debug) {
    return;
  }
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transport.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      console.log(err);
    }
  });
};
exports.sendMail = sendMail;

exports.sendNewInvoiceMail = function (who, invoice) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = invoice.name + ' 有新发票提交';
  var html = '<p>管理员您好：</p>' +
    '<p>' + invoice.name + '在Fubot发票系统中提交了新发票报销申请，请查看。</p>' +
    '<a href="http://' + config.host +'/invoice/id/' + invoice._id +  '">查看链接</a>';
  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
