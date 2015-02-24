var models = require('../models');
var Ticket   = models.Ticket;
var EventProxy = require('eventproxy');

exports.newAndSaveAll = function(objs, callback) {
  var ep = new EventProxy();
  var num = objs.length;
  ep.after('saved', num, function (tickets) {
    var totalPrice = 0;
    var Ids = [];
    for (var j = 0; j < num; j++) {
      totalPrice += tickets[j].price;
      Ids.push(tickets[j]._id);
    }
    callback(null, Ids, totalPrice, tickets);
  });

  for (var i = 0; i < num; i++) {
    exports.newAndSave(objs[i], function (err, newTicket) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('saved', newTicket);
    });
  }
};

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var ticket = new Ticket();
  ticket.flights = obj.flights;
  ticket.departure = obj.departure;
  ticket.destination = obj.destination;
  ticket.date = obj.date;
  ticket.person = obj.person;
  ticket.price = obj.price;
  ticket.note = obj.note;

  ticket.save(callback);
};

exports.getTicketsByIds = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('found', num, function (tickets) {
    callback(null, tickets);
  });
  for (var k = 0; k < num; k++) {
    exports.getTicketById(ids[k], function (err, ticket) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('found', ticket);
    });
  }
};

exports.getTicketById = function (id, callback) {
  Ticket.findById(id, callback);
};

exports.findByIdsAndDelete = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('deleted', num, function (tickets) {
    callback(null, tickets);
  });
  for (var n = 0; n < num; n++) {
    exports.findByIdAndDelete(ids[n], function (err, ticket) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('deleted', ticket);
    });
  }
};

exports.findByIdAndDelete = function (id, callback) {
  Ticket.findByIdAndRemove(id, callback);
};