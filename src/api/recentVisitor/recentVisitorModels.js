const executeQuery = require("../../helper/common").executeQuery;

async function getRecentVisitor(params, callBack) {
  const { date } = params;
  let selectSql = `
        SELECT
            a.*,
            u.name,
            u.birthdate as age
  `;

  var sql = `
        FROM
            appointments a
        LEFT JOIN
            users u on u.user_id = a.patient_id
        WHERE 
            a.deleted_at IS NULL
    `;

  if (date) {
    sql += ` AND DATE(a.date) = '${date}'`;
  }

  sql += ` ORDER BY a.created_at DESC;`;

  let paginationSQL = ` ORDER BY last_submission_date DESC LIMIT ${
    offset * itemsPerPage
  }, ${itemsPerPage}`;

  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(result);
    else callBack(false);
  });
}

module.exports = {
  getRecentVisitor,
};
