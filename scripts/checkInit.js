var client = require('../models/redisClient.js');

/**
 * check exchange_coupon_users
 */
client.scard('exchange_coupon_users', function (err, res) {
  console.log(res);
});

/**
 * check success_order_users
 */
client.scard('success_order_users', function (err, res) {
  console.log(res);
});