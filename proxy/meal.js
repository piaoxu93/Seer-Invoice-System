var models = require('../models');
var Meal   = models.Meal;
var EventProxy = require('eventproxy');

exports.newAndSaveAll = function(objs, callback) {
  var ep = new EventProxy();
  var num = objs.length;
  ep.after('saved', num, function (meals) {
    var totalPrice = 0;
    var Ids = [];
    for (var j = 0; j < num; j++) {
      totalPrice += meals[j].price;
      Ids.push(meals[j]._id);
    }
    callback(null, Ids, totalPrice, meals);
  });

  for (var i = 0; i < num; i++) {
    exports.newAndSave(objs[i], function (err, newMeal) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('saved', newMeal);
    });
  }
};

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var meal = new Meal();
  meal.restaurant = obj.restaurant;
  meal.address = obj.address;
  meal.date = obj.date;
  meal.person = obj.person;
  meal.price = obj.price;
  meal.note = obj.note;

  meal.save(callback);
};

exports.getMealsByIds = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('found', num, function (meals) {
    callback(null, meals);
  });
  for (var k = 0; k < num; k++) {
    exports.getMealById(ids[k], function (err, meal) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('found', meal);
    });
  }
};

exports.getMealById = function (id, callback) {
  Meal.findById(id, callback);
};

exports.findByIdsAndDelete = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('deleted', num, function (meals) {
    callback(null, meals);
  });
  for (var n = 0; n < num; n++) {
    exports.findByIdAndDelete(ids[n], function (err, meal) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('deleted', meal);
    });
  }
};

exports.findByIdAndDelete = function (id, callback) {
  Meal.findByIdAndRemove(id, callback);
};