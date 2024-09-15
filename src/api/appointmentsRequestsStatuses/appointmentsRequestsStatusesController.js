var mod = require("./appointmentsRequestsStatusesModels");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

async function getAppointmentsRequestsStatuses(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.query;
        mod.getAppointmentsRequestsStatuses(params, (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getAppointmentsRequestsStatuses,
};
