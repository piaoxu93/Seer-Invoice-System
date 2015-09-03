var validator = require('validator');
var config = require('../config');
var tools = require('../common/tools');
var CashInvoice = require('../proxy').CashInvoice;
var Item = require('../proxy').Item;
var User = require('../proxy').User;
var mail = require('../common/mail');
var xss = require('xss');

exports.showSubmitCash = function (req, res, next) {
  res.render('submit/cash', {
    department: config.department,
    payMethod: config.payMethod,
    invoiceType: config.invoiceType,
    projects: config.projects,
    suppliers: config.suppliers
  });
};

exports.submitCash = function (req, res, next) {
  var invoice = {};
  invoice.name = xss(req.body.name);
  invoice.name = validator.trim(invoice.name);
  invoice.name = validator.escape(invoice.name);
  invoice.projectName = xss(req.body.projectName);
  invoice.projectName = validator.trim(invoice.projectName);
  invoice.projectName = validator.escape(invoice.projectName);
  if (!tools.checkStringInArray(invoice.projectName, config.projects)) {
    req.errorMsg = '请选择正确项目名称';
    return next();
  }
  invoice.department = xss(req.body.department);
  invoice.department = validator.trim(invoice.department);
  invoice.department = validator.escape(invoice.department);
  if (!tools.checkStringInArray(invoice.department, config.department)) {
    req.errorMsg = '请选择正确的费用支出部门';
    return next();
  }
  invoice.totalPrice = 0;
  invoice.requisitioner = xss(req.body.requisitioner);
  invoice.requisitioner = validator.trim(invoice.requisitioner);
  invoice.requisitioner = validator.escape(invoice.requisitioner);
  invoice.date = validator.toDate(req.body.date);
  var today = new Date();
  if (!invoice.date || invoice.date > today) {
    req.errorMsg = '请选择正确的申购日期';
    return next();
  }
  invoice.payMethod = xss(req.body.payMethod);
  invoice.payMethod = validator.trim(invoice.payMethod);
  invoice.payMethod = validator.escape(invoice.payMethod);
  if (!tools.checkStringInArray(invoice.payMethod, config.payMethod)) {
    req.errorMsg = '请选择正确的付款方式';
    return next();
  }
  invoice.arrivalDate = validator.toDate(req.body.arrivalDate);
  if (!invoice.arrivalDate || invoice.arrivalDate < invoice.date) {
    req.errorMsg = '请选择正确的到货日期';
    return next();
  }
  invoice.invoiceType = xss(req.body.invoiceType);
  invoice.invoiceType = validator.trim(invoice.invoiceType);
  invoice.invoiceType = validator.escape(invoice.invoiceType);
  if (!tools.checkStringInArray(invoice.invoiceType, config.invoiceType)) {
    req.errorMsg = '请选择正确的发票类别';
    return next();
  }
  invoice.detail = xss(req.body.detail);
  invoice.detail = validator.trim(invoice.detail);
  invoice.detail = validator.escape(invoice.detail);
  invoice.note = xss(req.body.note);
  invoice.note = validator.trim(invoice.note);
  invoice.note = validator.escape(invoice.note);

  invoice.itemId = [];

  var items = [];
  var itemNum = validator.toInt(req.body.itemNum);
  if (!itemNum || !(itemNum > 0)) {
    req.errorMsg = '请添加商品';
    return next();
  }
  for (var j = 0; j < itemNum; j++) {
    var item = {};
    if (!req.body['itemName' + j]) {
      continue;
    }
    item.itemName = xss(req.body['itemName' + j]);
    item.itemName = validator.trim(item.itemName);
    item.itemName = validator.escape(item.itemName);
    item.brand = xss(req.body['brand' + j]);
    item.brand = validator.trim(item.brand);
    item.brand = validator.escape(item.brand);
    item.model = xss(req.body['model' + j]);
    item.model = validator.trim(item.model);
    item.model = validator.escape(item.model);
    item.unitPrice = validator.toFloat(req.body['unitPrice' + j]);
    if (!item.unitPrice || !(item.unitPrice > 0)) {
      req.errorMsg = '请输入正确的单价';
      return next();
    }
    item.quantity = validator.toInt(req.body['quantity' + j]);
    if (!item.quantity || !(item.quantity > 0)) {
      req.errorMsg = '请输入正确的数量';
      return next();
    }
    items.push(item); // 将所有item存入invoice的一个数组元素中
  }

  Item.newAndSaveAll(items, function (err, Ids, totalPrice, newItems) {
    if (err) {
      req.errorMsg = err.toString();
      return next();
    }

    invoice.itemId = Ids;
    invoice.totalPrice = totalPrice;

    CashInvoice.newAndSave(invoice, function (err, newInvoice) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      newInvoice.dateStr = tools.dateFormat(newInvoice.date, 'yyyy-MM-dd , D');
      newInvoice.arrivalDateStr = tools.dateFormat(newInvoice.arrivalDate, 'yyyy-MM-dd , D');
      res.render('submit/cashsuccess', {
        invoice: newInvoice,
        items: newItems
      });
      // 发邮件给管理员
      for (var i = 0; i < config.admins_email.length; i++) {
        mail.sendNewInvoiceMail(config.admins_email[i], newInvoice, 'cash');
      }
      return;
    });

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
    CashInvoice.getInvoicesByName(user.name, {sort: '-createDate'},
      function (err, invoices) {
        if (err) {
          return next(err);
        }
        var totalInvoices = invoices.length;
        var totalMoney = 0;
        for (var i = 0; i < totalInvoices; i++) {
          totalMoney += invoices[i].totalPrice;
          if (i === 0) {
            invoices[i].prev = '';
            if (totalInvoices > 1) {
              invoices[i].next = invoices[i+1]._id;
            }
          } else if (i > 0 && i < totalInvoices - 1) {
            invoices[i].prev = invoices[i-1]._id;
            invoices[i].next = invoices[i+1]._id;
          } else {
            invoices[i].prev = invoices[i-1]._id;
            invoices[i].next = '';
          }
        }
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
        res.render('invoice/mycashinvoices', {
          dateFormat: tools.dateFormat,
          invoices: invoices,
          currentPage: currentPage,
          totalInvoices: totalInvoices,
          totalMoney: totalMoney.toFixed(2),
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
  id = xss(id);
  id = validator.trim(id);
  id = validator.escape(id);
  var prev = req.query.prev;
  if (!!prev) {
    prev = xss(prev);
    prev = validator.trim(prev);
    prev = validator.escape(prev);
  }
  var nex = req.query.next;
  if (!!nex) {
    nex = xss(nex);
    nex = validator.trim(nex);
    nex = validator.escape(nex);
  }
  CashInvoice.getInvoiceById(id, function (err, invoice) {
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
      invoice.dateStr = tools.dateFormat(invoice.date, 'yyyy-MM-dd , D');
      invoice.arrivalDateStr = tools.dateFormat(invoice.arrivalDate, 'yyyy-MM-dd , D');
      Item.getItemsByIds(invoice.itemId, function (err, items) {
        if (err) {
          req.errorMsg = err.toString();
          return next();
        }
        res.render('invoice/cashinvoice', {
          dateFormat: tools.dateFormat,
          invoice: invoice,
          items: items,
          prev: prev,
          next: nex,
        });
        return;
      });
    }
  });
};

exports.showAllInvoice = function (req, res, next) {
  var currentPage = validator.toInt(req.params.page);
  if (!currentPage) {
    res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
    return;
  }
  CashInvoice.getInvoices({limit: config.limit, sort: '-createDate'},
    function (err, invoices) {
      if (err) {
        return next(err);
      }
      var totalInvoices = invoices.length;
      var totalMoney = 0;
      for (var i = 0; i < totalInvoices; i++) {
        totalMoney += invoices[i].totalPrice;
        if (i === 0) {
          invoices[i].prev = '';
          if (totalInvoices > 1) {
            invoices[i].next = invoices[i+1]._id;
          }
        } else if (i > 0 && i < totalInvoices - 1) {
          invoices[i].prev = invoices[i-1]._id;
          invoices[i].next = invoices[i+1]._id;
        } else {
          invoices[i].prev = invoices[i-1]._id;
          invoices[i].next = '';
        }
      }
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
      res.render('invoice/cashinvoices', {
        dateFormat: tools.dateFormat, // 把格式化函数传出去，invoices中所有元素的date在视图渲染时格式化
        invoices: invoices,
        currentPage: currentPage,
        totalInvoices: totalInvoices,
        totalMoney: totalMoney.toFixed(2),
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
  progress = xss(progress);
  progress = validator.escape(progress);
  if (!tools.checkStringInArray(progress, config.progress)) {
    res.render('notify/notify', {error: '请选择正确的报销进度'});
    return;
  } else {
    CashInvoice.findByIdAndUpdateProgress(req.body._id, progress,
      function (err, invoice) {
        if (err) {
          return next(err);
        }
        if (!invoice) {
          res.render('notify/notify', {error: '不存在此发票'});
          return;
        }
        Item.getItemsByIds(invoice.itemId, function (err, items) {
          if (err) {
            req.errorMsg = err.toString();
            return next();
          }
          res.render('invoice/cashinvoice', {
            dateFormat: tools.dateFormat,
            invoice: invoice,
            notify: '修改进度成功',
            items: items
          });
          return;
        });
      });
  }
};

exports.deleteInvoice = function (req, res, next) {
  var id = validator.trim(req.body._id);
  id = xss(id);
  id = validator.escape(id);
  CashInvoice.findByIdAndDeleteInvoice(id, function (err, invoice) {
    if (err) {
      return next(err);
    }
    if (!invoice) {
      res.render('notify/notify', {error: '不存在此发票'});
      return;
    }
    Item.findByIdsAndDelete(invoice.itemId, function (err, items) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      res.render('notify/notify', {success: '删除成功', backTo: '/cashinvoices/1'});
      return;
    });
  });
};