const executeQuery = require("../../helper/common").executeQuery;

async function getAppointmentsStatuses(params, callBack) {
  var sql = `SELECT * FROM appointments_statuses`;

  executeQuery(sql, "getAppointmentsStatuses", (result) => {
    if (result) callBack(result);
    else callBack(false);
  });
}

module.exports = {
  getAppointmentsStatuses,
};
