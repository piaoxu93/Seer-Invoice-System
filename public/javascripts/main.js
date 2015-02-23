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
    if (!!date || !!arrivalDate) {
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
            '<input class="form-control" required min="0" name="unitPrice' + (itemNum - 1) + '" style="width:139px" placeholder="e.g. 100.00">' +
          '</div>' +
          '<br />' +
          '<br />' +
          '<label>数量</label><label class="red-star">*</label>' +
          '<input type="number" class="form-control" name="quantity' + (itemNum - 1) + '" required min="1" style="width:80px;">' +
        '</div>' +
        '<hr />' +
      '</div>');
  });

  // print
  $('#printInvoice').click(function(event) {
    $('#changeprogress').addClass('noPrint');
    $('#deleteinvoice').addClass('noPrint');
    $('#signature1').removeClass('noPrint');
    $('#signature2').removeClass('noPrint');
    $('#signature3').removeClass('noPrint');
    $('.hr').removeClass('noPrint');
    $('.hr1').addClass('noPrint');
    window.print();
    $('#changeprogress').removeClass('noPrint');
    $('#deleteinvoice').removeClass('noPrint');
    $('#signature1').addClass('noPrint');
    $('#signature2').addClass('noPrint');
    $('#signature3').addClass('noPrint');
    $('.hr').addClass('noPrint');
    $('.hr1').removeClass('noPrint');
    event.preventDefault();
    return;
  });
});

