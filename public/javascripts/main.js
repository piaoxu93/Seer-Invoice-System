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

