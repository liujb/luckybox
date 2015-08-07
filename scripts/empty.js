var util = require('util');
var redis = require("redis");
var client = redis.createClient();
var allConf = require('../conf/activity.js');
var keyPrefix = require('../conf/keyPrefix.js');

/**
 * [description]
 * @param  {[type]} err) { console.log("Error " + err);} [description]
 * @return {[type]}      [description]
 */
client.on("error", function (err) {
  console.log("Error " + err);
});


var empty = function (data) {
  if (!util.isArray(data)) return console.log('When empty data is not array');

  data.forEach(function (it) {
    console.log(it);
    var activityId = it.activityId;
    var keys = [keyPrefix.settings + activityId, keyPrefix.details + activityId];

    keys.forEach(function (item) {
      client.del(item, function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
    })
  });
};

empty(allConf);
