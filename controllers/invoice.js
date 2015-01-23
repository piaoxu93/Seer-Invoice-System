var validator = require('validator');
var config = require('../config');
var tools = require('../common/tools');
var Invoice = require('../proxy').Invoice;
var User = require('../proxy').User;
var mail = require('../common/mail');

exports.showSubmit = function (req, res, next) {
  res.render('submit/index');
};

exports.submit = function (req, res, next) {
  var invoice = {};
  invoice.name = validator.trim(req.body.name);
  invoice.name = validator.escape(invoice.name);
  invoice.projectName = validator.trim(req.body.projectName);
  invoice.projectName = validator.escape(invoice.projectName);
  invoice.department = validator.trim(req.body.department);
  invoice.department = validator.escape(invoice.department);
  if (!tools.checkStringInArray(invoice.department, config.department)) {
    req.errorMsg = '请选择正确的费用支出部门';
    return next();
  }
  invoice.itemName = validator.trim(req.body.itemName);
  invoice.itemName = validator.escape(invoice.itemName);
  invoice.brand = validator.trim(req.body.brand);
  invoice.brand = validator.escape(invoice.brand);
  invoice.model = validator.trim(req.body.model);
  invoice.model = validator.escape(invoice.model);
  invoice.unitPrice = validator.toFloat(req.body.unitPrice);
  if (!invoice.unitPrice || !(invoice.unitPrice > 0)) {
    req.errorMsg = '请输入正确的单价';
    return next();
  }
  invoice.quantity = validator.toInt(req.body.quantity);
  if (!invoice.quantity || !(invoice.quantity > 0)) {
    req.errorMsg = '请输入正确的数量';
    return next();
  }
  invoice.total = invoice.unitPrice * invoice.quantity;
  invoice.requisitioner = validator.trim(req.body.requisitioner);
  invoice.requisitioner = validator.escape(invoice.requisitioner);
  invoice.date = validator.toDate(req.body.date);
  invoice.dateStr = validator.trim(req.body.date);
  invoice.dateStr = validator.escape(invoice.dateStr);
  var today = new Date();
  if (!invoice.date || invoice.date > today) {
    req.errorMsg = '请选择正确的申购日期';
    return next();
  }
  invoice.payMethod = validator.trim(req.body.payMethod);
  invoice.payMethod = validator.escape(invoice.payMethod);
  if (!tools.checkStringInArray(invoice.payMethod, config.payMethod)) {
    req.errorMsg = '请选择正确的付款方式';
    return next();
  }
  invoice.arrivalDate = validator.toDate(req.body.arrivalDate);
  invoice.arrivalDateStr = validator.trim(req.body.arrivalDate);
  invoice.arrivalDateStr = validator.escape(invoice.arrivalDateStr);
  if (!invoice.arrivalDate || invoice.arrivalDate > today) {
    req.errorMsg = '请选择正确的到货日期';
    return next();
  }
  invoice.invoiceType = validator.trim(req.body.invoiceType);
  invoice.invoiceType = validator.escape(invoice.invoiceType);
  if (!tools.checkStringInArray(invoice.invoiceType, config.invoiceType)) {
    req.errorMsg = '请选择正确的发票类别';
    return next();
  }
  invoice.detail = validator.trim(req.body.detail);
  invoice.detail = validator.escape(invoice.detail);
  invoice.note = validator.trim(req.body.note);
  invoice.note = validator.escape(invoice.note);
  Invoice.newAndSave(invoice, function (err, newInvoice) {
    if (err) {
      req.errorMsg = err.toString();
      return next();
    }
    res.render('submit/success', invoice);
    // 发邮件给管理员
    for (var i = 0; i < config.admins_email.length; i++) {
      mail.sendNewInvoiceMail(config.admins_email[i], newInvoice);
    }
    return;
  });
};

exports.submitError = function(req, res, next) {
  res.render('submit/error', {
    error: req.errorMsg
  });
};

exports.showUserInvoice = function (req, res, next) {
  var userName = req.session.user.loginname;
  var currentPage = validator.toInt(req.params.page);
  if (!currentPage) {
    res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
    return;
  }
  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render('notify/notify', {error: '这个用户不存在。'});
      return;
    }
    Invoice.getInvoicesByName(user.name, {sort: '-createDate'},
      function (err, invoices) {
        if (err) {
          return next(err);
        }
        var totalInvoices = invoices.length;
        var pages = Math.ceil(totalInvoices / config.page_limit);
        // 没有记录的时候
        if (pages === 0 ) { pages++ };
        if (currentPage < 1 || currentPage > pages) {
          res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
          return;
        } else if (currentPage === pages) {
          invoices = invoices.slice(config.page_limit * (pages - 1));
        } else {
          invoices = invoices.slice(config.page_limit * (currentPage -1),
                                    config.page_limit * currentPage);
        }
        res.render('invoice/myinvoice', {
          invoices: invoices,
          currentPage: currentPage,
          totalInvoices: totalInvoices,
          pages: pages,
          // 只显示最多前后5个分页
          pageRangeFirst: currentPage - 5 < 1 ? 1 : currentPage - 5,
          pageRangeLast: currentPage + 5 > pages ? pages : currentPage + 5
        });
        return;
      });

  });
};

exports.showInvoice = function (req, res, next) {
  var id = req.params.id;
  Invoice.getInvoiceById(id, function (err, invoice) {
    if (err) {
      return next(err);
    }
    if (!invoice) {
      res.render('notify/notify', {error: '不存在此发票'});
      return;
    }
    if (!config.admins[req.session.user.loginname] &&
        invoice.name !== req.session.user.name) {
      res.render('notify/notify', {error: '抱歉，你只能查看自己提交的发票'});
    } else {
      res.render('invoice/invoice', invoice);
    }
    return;
  });
};

exports.showAllInvoice = function (req, res, next) {
  var currentPage = validator.toInt(req.params.page);
  if (!currentPage) {
    res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
    return;
  }
  Invoice.getInvoices({limit: config.limit, sort: '-createDate'},
    function (err, invoices) {
      if (err) {
        return next(err);
      }
      var totalInvoices = invoices.length;
      var pages = Math.ceil(totalInvoices / config.page_limit);
      // 没有记录的时候
      if (pages === 0 ) { pages++ };
      if (currentPage < 1 || currentPage > pages) {
        res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
        return;
      } else if (currentPage === pages) {
        invoices = invoices.slice(config.page_limit * (pages - 1));
      } else {
        invoices = invoices.slice(config.page_limit * (currentPage -1),
                                  config.page_limit * currentPage);
      }
      res.render('invoice/invoices', {
        invoices: invoices,
        currentPage: currentPage,
        totalInvoices: totalInvoices,
        pages: pages,
        // 只显示最多前后5个分页
        pageRangeFirst: currentPage - 5 < 1 ? 1 : currentPage - 5,
        pageRangeLast: currentPage + 5 > pages ? pages : currentPage + 5
      });
      return;
    });
};

exports.changeProgress = function (req, res, next) {
  var progress = validator.trim(req.body.progress);
  progress = validator.escape(progress);
  if (!tools.checkStringInArray(progress, config.progress)) {
    res.render('notify/notify', {error: '请选择正确的报销进度'});
    return;
  } else {
    Invoice.findByIdAndUpdateProgress(req.body._id, progress,
      function (err, invoice) {
        if (err) {
          return next(err);
        }
        if (!invoice) {
          res.render('notify/notify', {error: '不存在此发票'});
          return;
        }
        invoice.notify = "修改进度成功";
        res.render('invoice/invoice', invoice);
        return;
      });
  }
};

exports.deleteInvoice = function (req, res, next) {
  var id = validator.trim(req.body._id);
  id = validator.escape(id);
  Invoice.findByIdAndDeleteInvoice(id, function (err, invoice) {
    if (err) {
      return next(err);
    }
    if (!invoice) {
      res.render('notify/notify', {error: '不存在此发票'});
      return;
    }
    res.render('notify/notify', {success: '删除成功', backTo: '/invoices/1'});
    return;
  });
};