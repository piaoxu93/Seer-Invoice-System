var models = require('../models');
var Hotel   = models.Hotel;
var EventProxy = require('eventproxy');

exports.newAndSaveAll = function(objs, callback) {
  var ep = new EventProxy();
  var num = objs.length;
  ep.after('saved', num, function (hotels) {
    var totalPrice = 0;
    var Ids = [];
    for (var j = 0; j < num; j++) {
      totalPrice += hotels[j].totalPrice;
      Ids.push(hotels[j]._id);
    }
    callback(null, Ids, totalPrice, hotels);
  });

  for (var i = 0; i < num; i++) {
    exports.newAndSave(objs[i], function (err, newHotel) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('saved', newHotel);
    });
  }
};

// 存入数据库
exports.newAndSave = function(obj, callback) {
  var hotel = new Hotel();
  hotel.name = obj.name;
  hotel.address = obj.address;
  hotel.checkInDate = obj.checkInDate;
  hotel.person = obj.person;
  hotel.unitPrice = obj.unitPrice;
  hotel.days = obj.days;
  hotel.note = obj.note;

  hotel.save(callback);
};

exports.getHotelsByIds = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('found', num, function (hotels) {
    callback(null, hotels);
  });
  for (var k = 0; k < num; k++) {
    exports.getHotelById(ids[k], function (err, hotel) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('found', hotel);
    });
  }
};

exports.getHotelById = function (id, callback) {
  Hotel.findById(id, callback);
};

exports.findByIdsAndDelete = function (ids, callback) {
  var ep = new EventProxy();
  var num = ids.length;
  ep.after('deleted', num, function (hotels) {
    callback(null, hotels);
  });
  for (var n = 0; n < num; n++) {
    exports.findByIdAndDelete(ids[n], function (err, hotel) {
      if (err) {
        req.errorMsg = err.toString();
        return next();
      }
      ep.emit('deleted', hotel);
    });
  }
};

exports.findByIdAndDelete = function (id, callback) {
  Hotel.findByIdAndRemove(id, callback);
};