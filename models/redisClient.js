var redis = require("redis");
var redisConf = require("../conf/redis");

// client settings
var client = redis.createClient(redisConf.port, redisConf.host, {no_ready_check: true});

/**
 * Monitor redis error event
 */
client.on("error", function (err) {
  console.log(err);
});

module.exports = client;

