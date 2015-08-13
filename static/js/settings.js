Zepto(function ($) {
  var socket = io(),
    btnSave = $("#btnSave"),
    btnFirstPrize = $("#btnFirstPrize"),
    btnSecondPrize = $("#btnSecondPrize"),
    btnThirdPrize = $("#btnThirdPrize"),
    hidPageType = $("#hid-page-type"),
    hidActivityId = $("#hid-activity-id");

  var map = {
    firstPrize: {
      desc: '一等奖',
      btn: btnFirstPrize,
      timesSpan: $('#sp-first-times'),
      haveSpan: $('#sp-first-have'),
      leftSpan: $('#sp-first-left')
    },
    secondPrize: {
      desc: '二等奖',
      btn: btnSecondPrize,
      timesSpan: $('#sp-second-times'),
      haveSpan: $('#sp-second-have'),
      leftSpan: $('#sp-second-left')
    },
    thirdPrize: {
      desc: '三等奖',
      btn: btnThirdPrize,
      timesSpan: $('#sp-third-times'),
      haveSpan: $('#sp-third-have'),
      leftSpan: $('#sp-third-left')
    }
  };

  // 检测按钮状态
  var checkButtonsStatus = function (actions, callback) {
    if (Object.prototype.toString.call(actions) !== '[object Array]') return;

    actions.forEach(function (it) {
      var tmp = map[it];
      var left = parseInt(tmp.leftSpan.text()),
        kls = left === 0 ? "btn-gray" : "btn-orange",
        enable = left === 0 ? "false" : "true";

      tmp.btn.attr('class', kls);
      tmp.btn.attr('enable', enable);

      if (hidPageType === 'detail') {
        if (left === 0) tmp.btn.html(tmp.desc + '完成');
      }
      if (typeof callback === 'function') callback(left === 0);
    });
  };

  // 检测按钮状态
  checkButtonsStatus(['firstPrize', 'secondPrize', 'thirdPrize']);

  if ($("#hid-page-type").val() === 'detail') {
    btnSave.attr('class', 'btn-gray');
    btnSave.attr('enable', 'false');

    $('input').each(function (index, item) {
      $(item).attr('disabled', 'disabled');
    });
  }

  /**
   * 多少秒后xx操作
   * @param  {[type]} time        [description]
   * @param  {[type]} ingCallback [description]
   * @param  {[type]} outCallback [description]
   * @return {[type]}             [description]
   */
  var runSecond = function (time, ingCallback, outCallback) {
    var interval;
    interval = setInterval(function () {
      if (typeof ingCallback === 'function') ingCallback(time);
      time--;
      if (time < 0) {
        clearInterval(interval);
        if (typeof outCallback === 'function') outCallback();
      }
    }, 1000);
  };

  /**
   * 保存配置
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  var saveSettings = function (that) {
    that.html('保存中...');
    that.toggleClass('btn-gray');

    console.log($('#form-setting').serialize());

    // post
    $.post('/settings', $('#form-setting').serialize(), function (res) {
      if (res === 'success') {
        $('input.prize-num').each(function (index, item) {
          $(item).attr('disabled', 'disabled');
        });
        Dialog.toast('保存成功');
      } else {
        that.toggleClass('btn-orange');
        Dialog.toast('保存失败');
      }
      that.html('保存');
      setTimeout(function () {
        location.reload()
      }, 500);
    });
  };

  /**
   * Reset or submit
   * @param  {[type]} e) {var id [description]
   * @return {[type]}    [description]
   */
  $('.settings-wrap-buttons').on('tap', 'a', function (e) {

    var that = $(e.target);
    var id = that.attr("id");

    if (that.attr('enable') !== 'true') {
      return false;
    }

    switch (id) {
      case 'btnSave':
        saveSettings(that);
        break;
      case 'btnRoll':
        socket.emit('start roll', hidActivityId.val());
        break;
      case 'btnPause':
        socket.emit('pause roll', hidActivityId.val());
        break;
      default:
        break;
    }
    ;
  });


  /**
   * input event validate
   * @param  {[type]} e) {               var val [description]
   * @return {[type]}    [description]
   */
  var allowStrongLuckyCnt = false;
  $('.settings').on('input', 'input', function (e) {
    var that = $(e.target);

    // 只能输入数字
    var val = that.val().replace(/\D/g, '');
    that.val(val);

    // 对抽奖总数和次数做了一个简单的提示，
    // 以免输入错误导致
    if (parseInt(that.val()) > 99 && !allowStrongLuckyCnt) {
      Dialog.confirm('抽奖总数或次数过多，确认吗？').then(function (result) {
        if (result) {
          allowStrongLuckyCnt = true;
        } else {
          that.val('');
        }
      });
    }

    // 抽奖次数不能大于抽奖个数
    var inputs = that.parent().children('input');
    if (parseInt(inputs.last().val()) > parseInt(inputs.first().val())) {
      Dialog.alert('抽奖次数不能大于奖项个数！').then(function () {
        inputs.last().val('');
      });
    }

    // 检测保存按钮是否该激活
    var validTmpResult = true;
    $('input').each(function (index, item) {
      if (!$(item).val()) validTmpResult = false;
    });

    if (validTmpResult) {
      btnSave.attr('class', 'btn-orange');
      btnSave.attr('enable', 'true');
    }
  });

  // lucky draw
  $('.details-wrap-buttons').on('tap', 'a', function (e) {
    var that = $(this),
      id = that.attr('id'),
      enable = that.attr('enable'),
      btnText = that.html(),
      actionName = that.attr('action-name');

    if ('false' === enable) return console.log('false');

    that.attr('enable', 'false');
    that.attr('class', 'btn-gray');

    runSecond(5, function (time) {
      that.html('稍等' + time + '秒');
    }, function () {

      checkButtonsStatus([actionName], function (isOver) {
        if (isOver) return that.html(map[actionName].desc + '结束');

        that.html(btnText);
        that.attr('enable', 'true');
        that.attr('class', 'btn-orange');
      });
    });

    socket.emit('drawLuckyUsers', {
      actionName: actionName,
      activityId: hidActivityId.val()
    });

    console.log('gogogo')

  });

  // get draw lucky result
  socket.on('drawLuckyResult', function (data) {
    if (!data.result) {
      return console.log('Error.');
    }

    var doms = map[data.actionName],
      sum = parseInt(doms.timesSpan.text()),
      have = parseInt(doms.haveSpan.text()),
      left = parseInt(doms.leftSpan.text());

    if (have < sum) have += 1;
    if (left > 0) left -= 1;
    doms.haveSpan.text(have);
    doms.leftSpan.text(left);
  });

});
