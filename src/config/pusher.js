const Pusher = require("pusher");
var executeQuery = require("../helper/common").executeQuery;

const pusher = new Pusher({
  appId: "1576333",
  key: "9c36a8d1d324842389dd",
  secret: "d9396fbf29e27c7282b4",
  cluster: "ap1",
  useTLS: true,
});

const sendPrescriptionCreateNotification = (notificationObject) => {
  const channelName = `prescription_notification`;
  const eventName = "prescription_create";
  pusher.trigger(channelName, eventName, {
    ...notificationObject,
    channelBrodcast: 2,
  });
};

module.exports = {
  sendPrescriptionCreateNotification,
};
