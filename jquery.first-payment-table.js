
'use strict';
(function() {

  var elementSelector = window.BLOSSOM_PAYMENT_DATES_CONTAINER || '#payment-dates-container';
  var libsUrlBase = window.BLOSSOM_PAYMENT_DATES_DOMAIN || '';

  function loadScriptIfAbsent(opts) {
    var name = opts.name;
    var src = opts.src;
    var url = opts.url;
    var callback = opts.callback;
    if (window.name) {
      callback(name);
      return;
    }
    var script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      callback(name);
    };
    document.head.append(script);
  }

  var profitPaymentDates = function() {
    var FORMAT = 'MMM D';
    var MONTHLY_PAYMENT_DROP = 15;
    var tableHtml = '<table class="table table-striped table-sm"><thead><tr><th>Funds Received</th><th>1st Cycle Starts</th><th>1st Cycle Ends</th><!-- <th>Pro-Rata Share</th> --><th>1st Payment Credited</th><th>Payment Notification</th><!-- th>2nd Payment</th --></tr></thead><tbody></tbody></table>';
    var now = moment().startOf('day');
    var startDate = now.clone().subtract(50, 'days');
    var endDate = now.clone().add(10, 'days');
    var fundsReceived = startDate.clone();
    var rows = '';
    while (fundsReceived.isBefore(endDate)) {
      fundsReceived.add(1, 'day');
      var cutoff = fundsReceived.clone().date(20);
      var periodStart = fundsReceived.clone().add(1, 'day');
      if (fundsReceived.isAfter(cutoff, 'day')) {
        periodStart = fundsReceived.clone().endOf('month').add(1, 'day');
      }
      var daysInMonth = periodStart.daysInMonth();
      var periodEnd = periodStart.clone().date(daysInMonth).endOf('day');
      var firstPaymentCredited = periodEnd.clone().add(1, 'days');
      var firstPaymentMade = firstPaymentCredited.clone().date(MONTHLY_PAYMENT_DROP);
      var secondPayment = firstPaymentCredited.clone().add(1, 'month');
      var daysInPeriod = Math.round(periodEnd.diff(periodStart, 'days', true));
      if (fundsReceived.isAfter(cutoff, 'day')) {
        daysInPeriod += 1;
      }
      var proRata = Math.round( (daysInPeriod / daysInMonth) * 100 );

      var fundsReceivedCell = '<td>' + fundsReceived.format(FORMAT) + '</td>';
      var firstCycleStartsCell = '<td>' + periodStart.clone().format(FORMAT) + '</td>';
      var firstCycleEndsCell = '<td>' + periodEnd.add(1, 'day').subtract(1, 'day').format(FORMAT) + '</td>';
      // var proRataShareCell = '<td>' + proRata + '% (' + daysInPeriod + ' of ' + daysInMonth + ' Days)</td>';
      var firstPaymentCreditedOnCell = '<td>' + firstPaymentCredited.format(FORMAT) + '</td>';
      var firstPaymentMadeOnCell = '<td>' + firstPaymentMade.format(FORMAT) + '</td>';
      // var secondPaymentOnCell = '<td>' + secondPayment.format(FORMAT) + '</td>';

      var rowStart = fundsReceived.isSame(now, 'day') ?
        '<tr class="table-warning">' : '<tr>';
      rows += rowStart +
        fundsReceivedCell +
        firstCycleStartsCell +
        firstCycleEndsCell +
        // proRataShareCell +
        firstPaymentCreditedOnCell +
        firstPaymentMadeOnCell +
        // secondPaymentOnCell +
        '</tr>';
    }
    return this.each(function() {
      var $container = $(this);
      var $table = $container.append(tableHtml);
      $table.find('tbody').append(rows);
    });
  };

  var loaded = {
    jQuery: false,
    moment: false
  };

  var initWhenLoaded = function(name) {
    loaded[name] = true;
    var allLoaded = true;
    for (var key in loaded) {
      allLoaded = allLoaded && loaded[key];
    }
    if (!allLoaded) {
      return;
    }
    jQuery.fn.profitPaymentDates = profitPaymentDates;
    jQuery(elementSelector).profitPaymentDates();
  };

  loadScriptIfAbsent({
    name: 'jQuery',
    src: libsUrlBase + 'jquery.min.js',
    callback: initWhenLoaded
  });

  loadScriptIfAbsent({
    name: 'moment',
    src: libsUrlBase + 'moment.js',
    callback: initWhenLoaded
  });

})();
