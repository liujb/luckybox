var express = require('express');
var router = express.Router();
var EJS = require('ejs');
var settingsModel = require('../models/settings.js');
var detailsModel = require('../models/details.js');

/* GET home page. */
router.get('/', function (req, res, next) {

  var activities = require('../conf/activity.js');
  res.render('index', {
    title: '滴滴打车',
    parseScript: true,
    data: activities
  });

});

/* GET home page. */
router.get('/board', function (req, res, next) {
  var query = req.query;

  res.render('board', {
    title: '滴滴打车',
    parseScript: true,
    activityId: query.activityId
  });

});

/* Get the control page */
router.get('/settings', function (req, res, next) {
  var query = req.query;
  var activityId = parseInt(query.activityId);

  if (isNaN(activityId) || activityId <= 0) {
    console.error('Params error.');
    return res.send('Params error.');
  }

  var renderData = {
    title: '滴滴打车',
    parseScript: true,
    activityId: activityId
  };

  settingsModel.get(activityId, function (setting) {
    renderData.setting = setting || {};
    renderData.pageType = setting && setting.activityId ? "detail" : "new";

    detailsModel.get(activityId, function (detail) {
      renderData.detail = detail || {};
      console.log(renderData);
      res.render('settings', renderData);
    });
  });

});

/* Post the control action*/
router.post('/settings', function (req, res, next) {
  var body = req.body;
  var activityId = parseInt(body.activityId);

  console.log(activityId);

  if (isNaN(activityId) || activityId <= 0) {
    console.log('Params error.');
    return res.send('Params error.');
  }

  // 保存设置
  settingsModel.save(body, function (res) {
    if (res !== 'OK') return console.log('Save ' + body.activityId + ' setting not ok.');
  });

  // 详情数据
  var drawDetails = {
    activityId: body.activityId,
    firstPrize: {
      totalCnt: body.firstPrizeCnt, // 一等奖总名数
      times: body.firstPrizeTimes, // 一等奖总共抽奖次数
      have: 0, // 已经抽过的次数
      left: body.firstPrizeTimes, // 剩余抽奖次数
      luckyPhones: []
    },
    secondPrize: {
      totalCnt: body.secondPrizeCnt, // 二等奖总名数
      times: body.secondPrizeTimes,
      have: 0,
      left: body.secondPrizeTimes,
      luckyPhones: []
    },
    thirdPrize: {
      totalCnt: body.thirdPrizeCnt, // 三等奖总名数
      times: body.thirdPrizeTimes,
      have: 0,
      left: body.thirdPrizeTimes,
      luckyPhones: []
    }
  };

  // 初始化抽奖详情数据并保存
  detailsModel.save(drawDetails, function (res2) {
    if (res2 !== 'OK') return console.log('Save ' + body.activityId + ' details not ok.');
  });

  res.send('success');
});

/* Get the admin page */
router.get('/details', function (req, res, next) {

  var query = req.query;
  var activityId = parseInt(query.activityId);
  if (isNaN(activityId) || activityId <= 0) return res.send('Params error.');

  detailsModel.get(activityId, function (details) {
    if(!details) details = {};
    console.log(details);

    res.render('details', {
      title: '滴滴打车',
      parseScript: true,
      detail: details
    });
  });

});


module.exports = router;
