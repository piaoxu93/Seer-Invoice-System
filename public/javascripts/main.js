$(document).ready(function () {

  // backtotop button
  var $backtotop = $('#backtotop');
  var top = $(window).height() - $backtotop.height() - 200;

  function moveBacktotop() {
    $backtotop.css({ top: top, right: 0});
  }

  $backtotop.click(function () {
    $('html,body').animate({ scrollTop: 0 });
    return false;
  });
  $(window).scroll(function () {
    var windowHeight = $(window).scrollTop();
    if (windowHeight > 200) {
      $backtotop.fadeIn();
    } else {
      $backtotop.fadeOut();
    }
  });

  moveBacktotop();
  $(window).resize(moveBacktotop);

  // check date
  $('#submit').click(function(event) {
    var today = new Date();
    var date = $('#date').val() ? new Date($('#date').val()) : null;
    var arrivalDate = $('#arrivalDate').val() ? new Date($('#arrivalDate').val()) : null;
    if (!!date && !!arrivalDate) {
      if (date > today) {
        event.preventDefault();
        alert('申购时间不能晚于今天');
        return;
      }
      if (!!date && !!arrivalDate && (arrivalDate < date)) {
        event.preventDefault();
        alert('到货时间不能早于申购时间');
        return;
      }
    }
    var temp = confirm("提交后用户将无法删除，确认无误并提交?");
    if (temp === true) {
      return;
    } else {
      event.preventDefault();
      return;
    }
  });

  // confirm delete
  $('#delete').click(function(event) {
    var temp = confirm("删除后无法复原，确定删除?");
    if (temp === true) {
      return;
    } else {
      event.preventDefault();
      return;
    }
  });

  var itemNum = 1;
  $('#itemNum').val(itemNum);
  $('#addItem').click(function(event) {
    itemNum++;
    $('#itemNum').val(itemNum);
    $(this).before('<div id="item' + itemNum + '">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="form-group">' +
          '<label class="gray-font">商品 ' + itemNum + '</label>' +
          '<br />' +
          '<br />' +
          '<label>名称</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="itemName' + (itemNum - 1) + '" required>' +
          '<label>品牌</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="brand'+ (itemNum - 1) + '" required>' +
          '<br />' +
          '<br />' +
          '<label>规格型号</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="model' + (itemNum - 1) + '" required>' +
          '<label>单价</label><label class="red-star">*</label>' +
          '<div class="input-group">' +
            '<div class="input-group-addon">¥</div>' +
            '<input class="form-control" required name="unitPrice' + (itemNum - 1) + '" style="width:139px" placeholder="e.g. 100.00">' +
          '</div>' +
          '<br />' +
          '<br />' +
          '<label>数量</label><label class="red-star">*</label>' +
          '<input type="number" class="form-control" name="quantity' + (itemNum - 1) + '" required min="1" style="width:80px;">' +
        '</div>' +
        '<hr />' +
      '</div>');
  });

  var ticketNum = 0;
  var hotelNum = 0;
  var mealNum = 0;
  $('#ticketNum').val(ticketNum);
  $('#hotelNum').val(hotelNum);
  $('#mealNum').val(mealNum);
  $('#addTicket').click(function(event) {
    ticketNum++;
    $('#ticketNum').val(ticketNum);
    $('#addButtonGroup').before('<div id="ticket' + ticketNum + '">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="form-group">' +
          '<label class="gray-font">车次/航班 ' + ticketNum + '</label>' +
          '<br />' +
          '<br />' +
          '<label>车次/航班</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="ticket-flights' + (ticketNum - 1) + '" required>' +
          '<label>出发时间</label><label class="red-star">*</label>' +
          '<input type="date" class="form-control" name="ticket-date' + (ticketNum - 1) + '" required style="width:172px;">' +
          '<br />' +
          '<br />' +
          '<label>出发地</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="ticket-departure'+ (ticketNum - 1) + '" required>' +
          '<label>目的地</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="ticket-destination' + (ticketNum - 1) + '" required>' +
          '<br />' +
          '<br />' +
          '<label>单价</label><label class="red-star">*</label>' +
          '<div class="input-group">' +
            '<div class="input-group-addon">¥</div>' +
            '<input class="form-control" required name="ticket-price' + (ticketNum - 1) + '" style="width:139px" placeholder="e.g. 100.00">' +
          '</div>' +
          '<label>乘客姓名</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="ticket-person'+ (ticketNum - 1) + '" required placeholder="e.g. 张三">' +
          '<br />' +
          '<br />' +
          '<label>备注</label>' +
          '<textarea class="form-control" rows="1" name="ticket-note' + (ticketNum - 1) + '" style="width:466px;"></textarea>' +
        '</div>' +
        '<hr />' +
      '</div>');
  });
  $('#addHotel').click(function(event) {
    hotelNum++;
    $('#hotelNum').val(hotelNum);
    $('#addButtonGroup').before('<div id="hotel' + hotelNum + '">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="form-group">' +
          '<label class="gray-font">酒店 ' + hotelNum + '</label>' +
          '<br />' +
          '<br />' +
          '<label>酒店名称</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="hotel-name' + (hotelNum - 1) + '" required>' +
          '<label>地址</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="hotel-address' + (hotelNum - 1) + '" required>' +
          '<br />' +
          '<br />' +
          '<label>入住时间</label><label class="red-star">*</label>' +
          '<input type="date" class="form-control" name="hotel-checkInDate'+ (hotelNum - 1) + '" required style="width:172px;">' +
          '<label>入住人员</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="hotel-person' + (hotelNum - 1) + '" required placeholder="e.g. 张三、李四">' +
          '<br />' +
          '<br />' +
          '<label>单价</label><label class="red-star">*</label>' +
          '<div class="input-group">' +
            '<div class="input-group-addon">¥</div>' +
            '<input class="form-control" required name="hotel-unitPrice' + (hotelNum - 1) + '" style="width:139px" placeholder="e.g. 100.00">' +
          '</div>' +
          '<label>天数</label><label class="red-star">*</label>' +
          '<input type="number" class="form-control" name="hotel-days' + (hotelNum - 1) + '" required min="1" style="width:80px;">' +
          '<br />' +
          '<br />' +
          '<label>备注</label>' +
          '<textarea class="form-control" rows="1" name="hotel-note' + (hotelNum - 1) + '" style="width:466px;"></textarea>' +
        '</div>' +
        '<hr />' +
      '</div>');
  });
  $('#addMeal').click(function(event) {
    mealNum++;
    $('#mealNum').val(mealNum);
    $('#addButtonGroup').before('<div id="hotel' + mealNum + '">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="form-group">' +
          '<label class="gray-font">餐饮 ' + mealNum + '</label>' +
          '<br />' +
          '<br />' +
          '<label>饭店名称</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="meal-restaurant' + (mealNum - 1) + '" required>' +
          '<label>地址</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="meal-address' + (mealNum - 1) + '" required>' +
          '<br />' +
          '<br />' +
          '<label>就餐时间</label><label class="red-star">*</label>' +
          '<input type="date" class="form-control" name="meal-date'+ (mealNum - 1) + '" required style="width:172px;">' +
          '<label>就餐人员</label><label class="red-star">*</label>' +
          '<input type="text" class="form-control" name="meal-person' + (mealNum - 1) + '" required placeholder="e.g. 张三、李四">' +
          '<br />' +
          '<br />' +
          '<label>价格</label><label class="red-star">*</label>' +
          '<div class="input-group">' +
            '<div class="input-group-addon">¥</div>' +
            '<input class="form-control" required name="meal-price' + (mealNum - 1) + '" style="width:139px" placeholder="e.g. 100.00">' +
          '</div>' +
          '<br />' +
          '<br />' +
          '<label>备注</label>' +
          '<textarea class="form-control" rows="1" name="meal-note' + (mealNum - 1) + '" style="width:466px;"></textarea>' +
        '</div>' +
        '<hr />' +
      '</div>');
  });

  // print
  $('#printInvoice').click(function(event) {
    // $('#changeprogress').addClass('noPrint');
    // $('#deleteinvoice').addClass('noPrint');
    // $('#detail').addClass('noPrint');
    // $('#note').addClass('noPrint');
    // $('.note').addClass('noPrint');
    // $('#signature').removeClass('noPrint');
    // $('.hr').removeClass('noPrint');
    // $('.hr1').addClass('noPrint');
    // $('#backtotop').css('display', 'none');
    // window.print();
    // $('#changeprogress').removeClass('noPrint');
    // $('#deleteinvoice').removeClass('noPrint');
    // $('#detail').removeClass('noPrint');
    // $('#note').removeClass('noPrint');
    // $('.note').removeClass('noPrint');
    // $('#signature').addClass('noPrint');
    // $('.hr').addClass('noPrint');
    // $('.hr1').removeClass('noPrint');
    // $('#backtotop').css('display', 'block');
    // event.preventDefault();
    // return;
    var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    var newstr = document.all.item('printPage').innerHTML;
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    document.body.innerHTML = oldstr;
    event.preventDefault();
    return;
  });

  // print monthly
  $('#confirm-monthly').click(function(event) {
    var today = new Date();
    var beginDate = $('#beginDate').val() ? new Date($('#beginDate').val()) : null;
    var endDate = $('#endDate').val() ? new Date($('#endDate').val()) : null;
    if (!beginDate || !endDate) {
      return;
    }
    beginDate.setHours(0);
    beginDate.setMinutes(0);
    beginDate.setSeconds(0);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    if (!!beginDate && !!endDate) {
      if (beginDate > today || endDate > today) {
        event.preventDefault();
        alert('起始时间或截止时间不能晚于今天');
        return;
      }
      if (beginDate > endDate) {
        event.preventDefault();
        alert('起始时间不能晚于截止时间');
        return;
      }
    }
    event.preventDefault();
    var users = window.location.pathname === '/printusermonthly' ? true : false;
    $.post('/monthlydata', {
      beginDate: beginDate,
      endDate: endDate,
      users: users
    },
    function (data, status) {
      if (status === 'success') {
        var printPage = $('#printPage');
        printPage.empty();
        var title = users ? '福物个人月度发票报销核对总表' : '福物月度发票报销核对总表';
        printPage.append('<table class="table table-condensed table-bordered" style="margin-bottom:0">' +
                           '<tr>' +
                             '<th style="text-align: center;">' + title + '</th>' +
                           '</tr>' +
                         '</table>');
        printPage.append('<table class="table table-condensed table-bordered" style="margin-bottom:0">' +
                           '<tbody>' +
                             '<tr>' +
                               '<th style="text-align: center; width: 25%">起始日期</th>' +
                               '<th style="text-align: center; width: 25%">' + dateFormat(new Date(data.beginDate), 'yyyy-MM-dd') + '</th>' +
                               '<th style="text-align: center; width: 25%">截止日期</th>' +
                               '<th style="text-align: center; width: 25%">' + dateFormat(new Date(data.endDate), 'yyyy-MM-dd') + '</th>' +
                             '</tr>' +
                           '</tbody>' +
                         '</table>');
        var i = 0;
        var sum = 0;
        printPage.append('<table id="table_1" class="table table-condensed table-bordered" style="margin-bottom:0; text-align: center;">' +
                           '<thead>' +
                             '<tr>' +
                               '<th style="text-align: center;">编号</th>' +
                               '<th style="text-align: center;">类型</th>' +
                               '<th style="text-align: center;">提交人</th>' +
                               '<th style="text-align: center;">项目名称</th>' +
                               '<th style="text-align: center;">提交时间</th>' +
                               '<th style="text-align: center;">金额</th>' +
                             '</tr>' +
                           '</thead>' +
                         '</table>');
        var table_1 = $('#table_1');
        for (; i < data.cash.length; i++) {
          table_1.append('<tr>' +
                            '<td style="text-align: center;">' + (i + 1) + '</th>' +
                            '<td style="text-align: center;">现金发票</th>' +
                            '<td style="text-align: center;">' + data.cash[i].name + '</th>' +
                            '<td style="text-align: center;">' + data.cash[i].projectName + '</th>' +
                            '<td style="text-align: center;">' + dateFormat(new Date(data.cash[i].createDate), 'yyyy-MM-dd') + '</th>' +
                            '<td style="text-align: center;">¥ ' + data.cash[i].totalPrice + '</th>' +
                          '</tr>');
          sum += data.cash[i].totalPrice;
        }
        var j = i;
        for (; i < data.travel.length + j; i++) {
          table_1.append('<tr>' +
                            '<td style="text-align: center;">' + (i + 1) + '</th>' +
                            '<td style="text-align: center;">差旅发票</th>' +
                            '<td style="text-align: center;">' + data.travel[i - j].name + '</th>' +
                            '<td style="text-align: center;">' + data.travel[i - j].projectName + '</th>' +
                            '<td style="text-align: center;">' + dateFormat(new Date(data.travel[i - j].createDate), 'yyyy-MM-dd') + '</th>' +
                            '<td style="text-align: center;">¥ ' + data.travel[i - j].totalPrice + '</th>' +
                          '</tr>');
          sum += data.travel[i - j].totalPrice;
        }

        printPage.append('<table class="table table-condensed table-bordered" style="margin-bottom:0; text-align: center;">' +
                           '<thead>' +
                             '<tr>' +
                               '<th style="text-align: center; width: 25%">合计</th>' +
                               '<th style="text-align: center; width: 25%">¥ ' + sum + '</th>' +
                               '<th style="text-align: center; width: 25%">审核人</th>' +
                               '<th style="text-align: center; width: 25%"></th>' +
                             '</tr>' +
                           '</thead>' +
                         '</table>');
      }
    });
    return;
  });

  // 时间格式化工具
  function dateFormat (date, fmt) {
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
});

