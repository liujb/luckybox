Zepto(function ($) {

  var socket = io();
  var dvResult = $('#dv-result');
  var activityId = $("#hid-acitvity-id").val();
  var dvTitle = $("#dv-title");
  var title = dvTitle.html();
  var map = {
    firstPrize: {
      desc: '一等奖'
    },
    secondPrize: {
      desc: '二等奖'
    },
    thirdPrize: {
      desc: '三等奖'
    }
  }

  /**
   * 开始滚动
   * @type {number}
   */
  var interval = 0;
  var startRoll = function (data) {
    interval = setInterval(function () {
      return socket.emit('getRandomPhones', data);
    }, 120);
  };

  /**
   * 处理结果
   * @param phones
   */
  var handlerPhones = function (phones) {
    if (Object.prototype.toString.call(phones) !== '[object Array]') return;

    var text = phones.join('\r\n');
    dvResult.text(text);
  }

  /**
   * Monitor the lucky result
   */
  socket.on("drawLuckyResult", function (data) {
    console.log(data);
    if (!data.result) {
      return console.log('抽奖没有结果.');
    }
    if (!data.phones.length) {
      return console.log('没有抽到用户.')
    }
    if (interval) {
      clearInterval(interval);
      interval = 0;
    }
    handlerPhones(data.phones);
    dvTitle.text('恭喜您，' + map[data.actionName].desc + '！！！');
  });

  /**
   * Monitor the get random phones
   */
  socket.on('getRandomPhones', function (phones) {
    if (interval === 0) return;
    handlerPhones(phones);
  });

  /**
   * Monitor the start roll
   */
  socket.on('start roll', function (data) {
    console.log('Server say roll ' + data);
    dvTitle.html(title);

    if (interval === 0) {  // 不加限制，当用户使劲点击滚动的时候屏幕滚动会加快且不可暂停了
      startRoll(activityId);
    }

  });

  /**
   *  Monitor the pause roll
   */
  socket.on('pause roll', function (data) {
    console.log('Server say pause ' + data);
    if (interval && data === activityId) {
      clearInterval(interval);
      interval = 0;
    }
  });

  // When coming page, we are ready go...
  startRoll(activityId);
});
