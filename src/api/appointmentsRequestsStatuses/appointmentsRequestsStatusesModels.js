const executeQuery = require("../../helper/common").executeQuery;

async function getAppointmentsRequestsStatuses(params, callBack) {
  var sql = `SELECT * FROM appointments_requests_statuses`;

  executeQuery(sql, "getAppointmentsStatuses", (result) => {
    if (result) callBack(result);
    else callBack(false);
  });
}

module.exports = {
  getAppointmentsRequestsStatuses,
};
