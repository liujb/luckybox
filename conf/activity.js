var activities = [{
  activityId: 1, // 活动ID
  name: '捐赠人感恩大抽奖', // 活动名称
  details: [{ // 一、二、三等奖的名称和种子用户的 key 的名称
    prizeName: 'firstPrize',
    seedUsersKey: 'exchange_coupon_users'
  }, {
    prizeName: 'secondPrize',
    seedUsersKey: 'exchange_coupon_users'
  }, {
    prizeName: 'thirdPrize',
    seedUsersKey: 'success_order_users'
  }]
}];

module.exports = activities;
