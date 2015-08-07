Zepto(function ($) {

  var socket = io();

  /**
   * Monitor the lucky result
   * whem have new, then reload page
   */
  socket.on("drawLuckyResult", function (data) {
    if (data.activityId === $("#hid-activity-id").val()) {
      location.reload();
    }
  });

});
