var client = require("./redisClient");
var keyPrefix = require('../conf/keyPrefix.js');
var detailModel = require('./details.js');
var allConf = require('../conf/activity.js');
var util = require('util');

var getConfById = function (activityId) {
  if (!util.isArray(allConf)) return console.log('All conf is not an array');

  var result = null;
  for (var i = allConf.length - 1; i >= 0; i--) {
    if (allConf[i].activityId == activityId) {
      result = allConf[i];
      break;
    }
  };
  return result;
};

/**
 * [save description]
 * @param  {[type]}   json     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var random = function (data, callback) {

  if (!data) return console.log('Get random users data is empty.');
  var actConf = getConfById(data);

    // conf like
    // {
    //   activityId: 1, // 活动ID
    //   name: '捐赠人感恩大抽奖', // 活动名称
    //   details: [{ // 一、二、三等奖的名称和种子用户的 key 的名称
    //     prizeName: 'firstPrize',
    //     seedUsersKey: 'exchange_coupon_users'
    //   }, {
    //     prizeName: 'secondPrize',
    //     seedUsersKey: 'exchange_coupon_users'
    //   }, {
    //     prizeName: 'thirdPrize',
    //     seedUsersKey: 'success_order_users'
    //   }]
    // }

  var len = actConf.details.length;
  var tmpArr = [];
  actConf.details.forEach(function (item, index) {
    tmpArr.push(item.seedUsersKey);
  });
  var randomIndex = Math.floor(Math.random() * len);

  console.log(tmpArr[randomIndex]);
  client.srandmember(tmpArr[randomIndex], 10, function (err, res) {
    if (err) return console.log(err);
    callback(res);
  });
};

/**
 * [get description]
 * @param  {[type]}   activityId [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
var luckyUsers = function (data, callback) {
  var activityId = parseInt(data.activityId);
  var actionName = data.actionName;

  var seedUsers = ""
  var actConf = getConfById(activityId);
  actConf.details.forEach(function (it) {
    if (actionName === it.prizeName) seedUsers = it.seedUsersKey;
  });

  if (!seedUsers) return console.log('No this action: ' + actionName);
  if (isNaN(activityId) || activityId <= 0) return console.log('Params error.');

  detailModel.get(activityId, function (detail) {
    var tmpPrize = detail[actionName];
    if (!tmpPrize) return console.log('Not found prize details: ' + actionName);

    var totalCnt = parseInt(tmpPrize.totalCnt);
    var times = parseInt(tmpPrize.times);
    var have = parseInt(tmpPrize.have);
    var left = parseInt(tmpPrize.left);

    var nums = 0;
    if (left > 1) {
      nums = (totalCnt % times === 0) ? totalCnt / times : Math.floor(totalCnt / times);
    } else {
      nums = totalCnt - tmpPrize.luckyPhones.length;
    }
    if (left <= 0) return console.log('不能再抽了，已经没有名额了....');

    // 随机抽取 nums 位幸运观众
    client.srandmember(seedUsers, nums, function (err, phones) {
      if (err) return console.log(err);

      console.log(phones);
      callback(phones);

      if (have < times) tmpPrize.have += 1;
      if (left > 0) tmpPrize.left -= 1;

      // 更新details
      phones.forEach(function (it) {
        tmpPrize.luckyPhones.push(it);
      });
      detail[tmpPrize] = tmpPrize;
      detailModel.save(detail, function (res) {
        if (res !== 'OK') return console.log(res);
      });

    });
  });
};

module.exports = {
  randomUsers: random,
  luckyUsers: luckyUsers
};
