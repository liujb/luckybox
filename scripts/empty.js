var util = require('util');
var keyPrefix = require('../conf/keyPrefix.js');
var client = require('../models/redisClient.js');
var allConf = require('../conf/activity.js');

if (!util.isArray(allConf)) return console.log('When empty data is not array');

allConf.forEach(function (it) {
  // console.log(it);
  var activityId = it.activityId;
  var keys = [keyPrefix.settings + activityId, keyPrefix.details + activityId];

  keys.forEach(function (item) {
    client.del(item, function (err, res) {
      if (err) return console.log(err);
      console.log(res);
      client.quit();
    });
  });
});

