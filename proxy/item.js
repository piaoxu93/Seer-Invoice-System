var models = require('../models');
var Item   = models.Item;
var EventProxy = require('eventproxy');

exports.newAndSaveAll = function(objs, callback) {
  var ep = new EventProxy();
  var num = objs.length;
  ep.after('saved', num, function (items) {
    var totalPrice = 0;
    var Ids = [];
    for (var j = 0; j < num; j++) {
      totalPrice += items[j].totalPrice;
      Ids.push(items[j]._id);
    }
    callback(null, Ids, totalPrice, items);
  });

  for (var i = 0; i < num; i++) {
    exports.newAndSave(objs[i], function (err, newItem) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('saved', newItem);
    });
  }
};

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var item = new Item();
  item.itemName = obj.itemName;
  item.brand = obj.brand;
  item.model = obj.model;
  item.unitPrice = obj.unitPrice;
  item.quantity = obj.quantity;

  item.save(callback);
};

exports.getItemsByIds = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('found', num, function (items) {
    callback(null, items);
  });
  for (var k = 0; k < num; k++) {
    (function (arg) {
      exports.getItemById(ids[arg], function (err, item) {
        if (err) {
          req.errorMsg = err.toString();
          return next();
        }
        ep.emit('found', item);
      });
    })(k);
  }
};

exports.getItemById = function (id, callback) {
  Item.findById(id, callback);
};

exports.findByIdsAndDelete = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('deleted', num, function (items) {
    callback(null, items);
  });
  for (var n = 0; n < num; n++) {
    exports.findByIdAndDelete(ids[n], function (err, item) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('deleted', item);
    });
  }
};

exports.findByIdAndDelete = function (id, callback) {
  Item.findByIdAndRemove(id, callback);
};