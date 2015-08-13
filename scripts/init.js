var util = require('util');
var client = require('../models/redisClient');
var lineReader = require('line-reader');
var confArr = require('../conf/activity.js');

var interval = 0;
var quitFlag = 0;
/**
 * 初始化数据
 * @param arr
 */
var initData = function (arr) {
  if (!util.isArray(arr)) return console.log('Not array');

  var item = null;
  for (var i = arr.length - 1; i >= 0; i--) {
    item = arr[i];
    if (!item.details || !util.isArray(item.details)) continue;

    // 注入数据
    item.details.forEach(function (it) {

      // 读取数据并且写入redis
      lineReader.eachLine(it.seedUsersKey + '.txt', function (line, last) {
        console.log(line);
        if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(line))) return;

        client.sadd(it.seedUsersKey, line, function (err, res) {
          if (err) return console.log(err);
          console.log(res);
        });

        if (last) return quitFlag++;
      });
    });

  }
};

// get the count
var totalItems = 0;
confArr.forEach(function (itm, index) {
  itm.details.forEach(function (it, ind) {
    totalItems++;
  })
});

// init the data
initData(confArr);

// client quit monitor
interval = setInterval(function () {
  console.log('confLenggh ' + confArr.length);
  console.log('interval ' + interval);
  console.log('quitFlagNum ' + quitFlag);
  console.log('totalItems ' + totalItems);

  if (interval && quitFlag === totalItems) {
    clearInterval(interval);
    quitFlag = 0;
    client.quit();
    console.log('DONE');
  }
}, 1000);

