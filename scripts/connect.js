var client = require('../models/redisClient.js');

/**
 * monitor ready event
 */
client.on('ready', function (err) {
  console.log('ready');
});

/**
 * monitor connect event
 */
client.on('connect', function () {
  console.log('connected');
  client.quit();
});

