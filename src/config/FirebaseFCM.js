var executeQuery = require("../helper/common").executeQuery;
const axios = require("axios");
// Retrieve the FCM token for the user with ID 123 from your database
const sendNotificationForUserMobile = async (data) => {
  console.log("FCM_NOTIFICATION-------->enterd");

  try {
    var dataResult = [];
    var sql = `select * from expo_fcm_tokens where expo_fcm_tokens.user_id=${data.user_id} AND expo_fcm_tokens.is_other=1`;
    console.log("FCM_NOTIFICATION-------->sql", sql);
    let resultdata = await new Promise((resolve) => {
      executeQuery(sql, "getExpoPushToken", (result) => {
        if (result && result.length > 0) {
          dataResult = result;
          console.log("FCM_NOTIFICATION-------->result", result);
        }
        resolve(result);
      });
    });

    if (!dataResult) {
      console.log("FCM_NOTIFICATION-------->no data");

      return false;
    }

    const body = data.is_supervisor
      ? `${data.employee_name} أرسل اليك طلب أجازة`
      : (data.status_id==1?'تمت الموافقة على':'تم رفض')+' طلب إجازتك من المشرف '+
        data.supervisor_name;

    const title =
      data.status_id == 1
        ? "الموافقة على طلب الأجازة"
        : data.status_id == 2
        ? "رفض طلب الأجازة"
        : "طلب أجازة";

    const options = {
      verify: false,
    };
    // Set the message to send to the user
    const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
    // The push token for the device you're sending the notification to

  
    for (let i = 0; i < dataResult.length; i++) {
      if (!dataResult[i] || !dataResult[i].token) {
        console.log(
          `FCM_NOTIFICATION-------->!dataResult[${i}].token not found`
        );

        return false;
      }
      console.log("FCM_NOTIFICATION-------->token found");

      var expoPushToken = dataResult[i].token;
      const message = {
        to: expoPushToken,
        title: title,
        body: body,
        vibration: [0, 250, 250, 250],
      };
      const requestOptions = {
        verify: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      axios
        .post(expoPushEndpoint, JSON.stringify(message), requestOptions)
        .then((response) => {
          console.log(response.data);
          console.log(
            "FCM_NOTIFICATION=======>Successfully sent message:",
            response
          );
        })
        .catch((error) => {
          console.error(error);
          console.log("FCM_NOTIFICATION=======>Error sending message:", error);
        });
    }
  } catch (err) {
    console.log("FCM_NOTIFICATION=======>error", err.message);
  }
};



module.exports = {
  sendNotificationForUserMobile,
};
