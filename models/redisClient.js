var redis = require("redis");
var redisConf = require("../conf/redis");

//
var client = redis.createClient(redisConf.port, redisConf.host);

/**
 * Monitor redis error event
 */
client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client;

