var validator = require('validator');
var config = require('../config');
var tools = require('../common/tools');
var TravelInvoice = require('../proxy').TravelInvoice;
var Ticket = require('../proxy').Ticket;
var Hotel = require('../proxy').Hotel;
var Meal = require('../proxy').Meal;
var User = require('../proxy').User;
var mail = require('../common/mail');
var xss = require('xss');
var EventProxy = require('eventproxy');

exports.showSubmitTravel = function (req, res, next) {
  res.render('submit/travel', {
    department: config.department,
    projects: config.projects
  });
};

exports.submitTravel = function (req, res, next) {
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

  invoice.ticketId = [];
  invoice.hotelId = [];
  invoice.mealId = [];

  var tickets = [], hotels = [], meals = [];
  var ticketNum = validator.toInt(req.body.ticketNum);
  var hotelNum = validator.toInt(req.body.hotelNum);
  var mealNum = validator.toInt(req.body.mealNum);
  var sum = ticketNum + hotelNum + mealNum;
  if (!sum || !(sum > 0)) {
    req.errorMsg = '你什么都没添加！';
    return next();
  }
  for (var j = 0; j < ticketNum; j++) {
    var ticket = {};
    ticket.flights = xss(req.body['ticket-flights' + j]);
    ticket.flights = validator.trim(ticket.flights);
    ticket.flights = validator.escape(ticket.flights);
    ticket.departure = xss(req.body['ticket-departure' + j]);
    ticket.departure = validator.trim(ticket.departure);
    ticket.departure = validator.escape(ticket.departure);
    ticket.destination = xss(req.body['ticket-destination' + j]);
    ticket.destination = validator.trim(ticket.destination);
    ticket.destination = validator.escape(ticket.destination);
    ticket.person = xss(req.body['ticket-person' + j]);
    ticket.person = validator.trim(ticket.person);
    ticket.person = validator.escape(ticket.person);
    ticket.note = xss(req.body['ticket-note' + j]);
    ticket.note = validator.trim(ticket.note);
    ticket.note = validator.escape(ticket.note);
    ticket.price = validator.toFloat(req.body['ticket-price' + j]);
    if (!ticket.price || !(ticket.price > 0)) {
      req.errorMsg = '请输入正确的单价';
      return next();
    }
    ticket.date = validator.toDate(req.body['ticket-date' + j]);
    if (!ticket.date) {
      req.errorMsg = '请选择正确的到货日期';
      return next();
    }
    tickets.push(ticket);
  }
  for (var k = 0; k < hotelNum; k++) {
    var hotel = {};
    hotel.name = xss(req.body['hotel-name' + k]);
    hotel.name = validator.trim(hotel.name);
    hotel.name = validator.escape(hotel.name);
    hotel.address = xss(req.body['hotel-address' + k]);
    hotel.address = validator.trim(hotel.address);
    hotel.address = validator.escape(hotel.address);
    hotel.person = xss(req.body['hotel-person' + k]);
    hotel.person = validator.trim(hotel.person);
    hotel.person = validator.escape(hotel.person);
    hotel.note = xss(req.body['hotel-note' + k]);
    hotel.note = validator.trim(hotel.note);
    hotel.note = validator.escape(hotel.note);
    hotel.unitPrice = validator.toFloat(req.body['hotel-unitPrice' + k]);
    if (!hotel.unitPrice || !(hotel.unitPrice > 0)) {
      req.errorMsg = '请输入正确的单价';
      return next();
    }
    hotel.days = validator.toInt(req.body['hotel-days' + k]);
    if (!hotel.days || !(hotel.days > 0)) {
      req.errorMsg = '请输入正确的入住天数';
      return next();
    }
    hotel.checkInDate = validator.toDate(req.body['hotel-checkInDate' + k]);
    if (!hotel.checkInDate) {
      req.errorMsg = '请选择正确的入住日期';
      return next();
    }
    hotels.push(hotel);
  }
  for (var n = 0; n < mealNum; n++) {
    var meal = {};
    meal.restaurant = xss(req.body['meal-restaurant' + n]);
    meal.restaurant = validator.trim(meal.restaurant);
    meal.restaurant = validator.escape(meal.restaurant);
    meal.address = xss(req.body['meal-address' + n]);
    meal.address = validator.trim(meal.address);
    meal.address = validator.escape(meal.address);
    meal.person = xss(req.body['meal-person' + n]);
    meal.person = validator.trim(meal.person);
    meal.person = validator.escape(meal.person);
    meal.note = xss(req.body['meal-note' + n]);
    meal.note = validator.trim(meal.note);
    meal.note = validator.escape(meal.note);
    meal.price = validator.toFloat(req.body['meal-price' + n]);
    if (!meal.price || !(meal.price > 0)) {
      req.errorMsg = '请输入正确的单价';
      return next();
    }
    meal.date = validator.toDate(req.body['meal-date' + n]);
    if (!meal.date) {
      req.errorMsg = '请选择正确的入住日期';
      return next();
    }
    meals.push(meal);
  }

  var ep = new EventProxy();
  ep.all('ticket', 'hotel', 'meal', function (tickets, hotels, meals) {
    TravelInvoice.newAndSave(invoice, function (err, newInvoice) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      res.render('submit/travelsuccess', {
        dateFormat: tools.dateFormat,
        invoice: newInvoice,
        tickets: tickets,
        hotels: hotels,
        meals: meals
      });
      // 发邮件给管理员
      for (var i = 0; i < config.admins_email.length; i++) {
        mail.sendNewInvoiceMail(config.admins_email[i], newInvoice);
      }
      return;
    });
  });

  if (tickets.length !== 0) {
    Ticket.newAndSaveAll(tickets, function (err, Ids, totalPrice, newTickets) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      invoice.ticketId = Ids;
      invoice.totalPrice += totalPrice;
      ep.emit('ticket', newTickets);
    });
  } else {
    ep.emit('ticket', []);
  }

  if (hotels.length !== 0) {
    Hotel.newAndSaveAll(hotels, function (err, Ids, totalPrice, newHotels) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      invoice.hotelId = Ids;
      invoice.totalPrice += totalPrice;
      ep.emit('hotel', newHotels);
    });
  } else {
    ep.emit('hotel', []);
  }

  if (meals.length !== 0) {
    Meal.newAndSaveAll(meals, function (err, Ids, totalPrice, newMeals) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      invoice.mealId = Ids;
      invoice.totalPrice += totalPrice;
      ep.emit('meal', newMeals);
    });
  } else {
    ep.emit('meal', []);
  }

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
    TravelInvoice.getInvoicesByName(user.name, {sort: '-createDate'},
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
        var totalMoney = 0;
        for (var i = 0; i < totalInvoices; i++) {
          totalMoney += invoices[i].totalPrice;
        }
        res.render('invoice/mytravelinvoices', {
          dateFormat: tools.dateFormat,
          invoices: invoices,
          currentPage: currentPage,
          totalInvoices: totalInvoices,
          totalMoney: totalMoney,
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
  TravelInvoice.getInvoiceById(id, function (err, invoice) {
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
      var ep = new EventProxy();
      ep.all('ticket', 'hotel', 'meal', function (tickets, hotels, meals) {
        res.render('invoice/travelinvoice', {
          dateFormat: tools.dateFormat,
          invoice: invoice,
          tickets: tickets,
          hotels: hotels,
          meals: meals
        });
        return;
      });

      if (invoice.ticketId.length !== 0) {
        Ticket.getTicketsByIds(invoice.ticketId, function (err, tickets) {
          if (err) {
            req.errorMsg = err.toString();
            return next();
          }
          ep.emit('ticket', tickets);
        });
      } else {
        ep.emit('ticket', []);
      }

      if (invoice.hotelId.length !== 0) {
        Hotel.getHotelsByIds(invoice.hotelId, function (err, hotels) {
          if (err) {
            req.errorMsg = err.toString();
            return next();
          }
          ep.emit('hotel', hotels);
        });
      } else {
        ep.emit('hotel', []);
      }

      if (invoice.mealId.length !== 0) {
        Meal.getMealsByIds(invoice.mealId, function (err, meals) {
          if (err) {
            req.errorMsg = err.toString();
            return next();
          }
          ep.emit('meal', meals);
        });
      } else {
        ep.emit('meal', []);
      }

    }
  });
};

exports.showAllInvoice = function (req, res, next) {
  var currentPage = validator.toInt(req.params.page);
  if (!currentPage) {
    res.render('notify/notify', {error: '抱歉，你要的页面不存在'});
    return;
  }
  TravelInvoice.getInvoices({limit: config.limit, sort: '-createDate'},
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
      var totalMoney = 0;
      for (var i = 0; i < totalInvoices; i++) {
        totalMoney += invoices[i].totalPrice;
      }
      res.render('invoice/travelinvoices', {
        dateFormat: tools.dateFormat, // 把格式化函数传出去，invoices中所有元素的date在视图渲染时格式化
        invoices: invoices,
        currentPage: currentPage,
        totalInvoices: totalInvoices,
        totalMoney: totalMoney,
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
    TravelInvoice.findByIdAndUpdateProgress(req.body._id, progress,
      function (err, invoice) {
        if (err) {
          return next(err);
        }
        if (!invoice) {
          res.render('notify/notify', {error: '不存在此发票'});
          return;
        }
        var ep = new EventProxy();
        ep.all('ticket', 'hotel', 'meal', function (tickets, hotels, meals) {
          res.render('invoice/travelinvoice', {
            invoice: invoice,
            tickets: tickets,
            hotels: hotels,
            meals: meals,
            notify: '修改进度成功',
          });
          return;
        });

        if (invoice.ticketId.length !== 0) {
          Ticket.getTicketsByIds(invoice.ticketId, function (err, tickets) {
            if (err) {
              req.errorMsg = err.toString();
              return next();
            }
            ep.emit('ticket', tickets);
          });
        } else {
          ep.emit('ticket', []);
        }

        if (invoice.hotelId.length !== 0) {
          Hotel.getHotelsByIds(invoice.hotelId, function (err, hotels) {
            if (err) {
              req.errorMsg = err.toString();
              return next();
            }
            ep.emit('hotel', hotels);
          });
        } else {
          ep.emit('hotel', []);
        }

        if (invoice.mealId.length !== 0) {
          Meal.getMealsByIds(invoice.mealId, function (err, meals) {
            if (err) {
              req.errorMsg = err.toString();
              return next();
            }
            ep.emit('meal', meals);
          });
        } else {
          ep.emit('meal', []);
        }

      });
  }
};

exports.deleteInvoice = function (req, res, next) {
  var id = validator.trim(req.body._id);
  id = xss(id);
  id = validator.escape(id);
  TravelInvoice.findByIdAndDeleteInvoice(id, function (err, invoice) {
    if (err) {
      return next(err);
    }
    if (!invoice) {
      res.render('notify/notify', {error: '不存在此发票'});
      return;
    }
    var ep = new EventProxy();
    ep.all('ticket', 'hotel', 'meal', function () {
      res.render('notify/notify', {success: '删除成功', backTo: '/travelinvoices/1'});
      return;
    });

    if (invoice.ticketId.length !== 0) {
      Ticket.findByIdsAndDelete(invoice.ticketId, function (err, tickets) {
        if (err) {
          req.errorMsg = err.toString();
          return next();
        }
        ep.emit('ticket');
      });
    } else {
      ep.emit('ticket');
    }

    if (invoice.hotelId.length !== 0) {
      Hotel.findByIdsAndDelete(invoice.hotelId, function (err, hotels) {
        if (err) {
          req.errorMsg = err.toString();
          return next();
        }
        ep.emit('hotel');
      });
    } else {
      ep.emit('hotel');
    }

    if (invoice.mealId.length !== 0) {
      Meal.findByIdsAndDelete(invoice.mealId, function (err, meals) {
        if (err) {
          req.errorMsg = err.toString();
          return next();
        }
        ep.emit('meal');
      });
    } else {
      ep.emit('meal');
    }

  });
};