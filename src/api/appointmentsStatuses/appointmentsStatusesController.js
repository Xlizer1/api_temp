var mod = require("./appointmentsStatusesModels");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

async function getAppointmentsStatuses(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.query;
        mod.getAppointmentsStatuses(params, (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getAppointmentsStatuses,
};
