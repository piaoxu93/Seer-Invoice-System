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
    callback(err, Ids, totalPrice);
  });

  for (var i = 0; i < num; i++) {
    exports.newAndSave(objs[i], function (err, newItem) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      var tempItem = {};
      tempItem._id = newItem._id;
      tempItem.totalPrice = newItem.totalPrice;
      ep.emit('saved', tempItem);
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

exports.getItemById = function (id, callback) {
  Item.findById(id, callback);
};

exports.findByIdAndDelete = function (id, callback) {
  Item.findByIdAndRemove(id, callback);
};