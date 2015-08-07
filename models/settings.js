var client = require("./redisClient");
var keyPrefix = require('../conf/keyPrefix.js');

/**
 * [save description]
 * @param  {[type]}   json     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var save = function (json, callback) {
  if (!json || !json.activityId || typeof json !== 'object') return console.log('Params error.');

  var activityId = parseInt(json.activityId);
  if (isNaN(activityId) || activityId <= 0) return console.log('Params error.');

  var key = keyPrefix.settings + activityId;
  client.set(key, JSON.stringify(json), function (err, res) {
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
var get = function (activityId, callback) {
  activityId = parseInt(activityId);
  if (isNaN(activityId) || activityId <= 0) return console.log('Params error.');

  var key = keyPrefix.settings + activityId;
  client.get(key, function (err, res) {
    if (err) return console.log(err);
    callback(JSON.parse(res));
  });
};

module.exports = {
  save: save,
  get: get
};
