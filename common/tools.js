
var bcrypt = require('bcrypt');
var moment = require('moment');
moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 12, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

exports.checkStringInArray = function (str, array) {
  var inArray = false;
  if (!(array instanceof Array)) {
    return false;
  }
  for (var i = 0; i < array.length; i++) {
    if (str === array[i]) {
      inArray = true;
      break;
    }
  }
  return inArray;
}

// 时间格式化工具
exports.dateFormat = function (date, fmt) {
  var days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  var o = {
    "M+" : date.getMonth() + 1,                   //月份
    "d+" : date.getDate(),                        //日
    "h+" : date.getHours(),                       //小时
    "m+" : date.getMinutes(),                     //分
    "s+" : date.getSeconds(),                     //秒
    "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
    "S"  : date.getMilliseconds(),                //毫秒
    "D"  : days[date.getDay()]                    // 星期几
  };
  if(/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if (new RegExp("("+ k +")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}