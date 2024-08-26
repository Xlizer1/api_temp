var executeQuery = require("../../helper/common").executeQuery;

async function getAppointments(params, callBack) {
  const { date, patient_name, doc_id, statuses_id } = params;

  var sql = `
          SELECT
              p.*,
              u.name,
              u.birthdate as age
          FROM
              prescription p
          LEFT JOIN
              users u on u.user_id = a.patient_id
          WHERE 
              a.deleted_at IS NULL
      `;

  if (date) {
    sql += ` AND DATE(a.date) = '${date}'`;
  }

  if (patient_name) {
    sql += ` AND u.name LIKE "%${patient_name}%"`;
  }

  // if (doc_id) {
  //   sql += ` AND DATE(a.date) = '${date}'`;
  // }

  if (statuses_id) {
    sql += ` AND a.status_id = ${JSON.parse(statuses_id)}`;
  }

  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(result);
    else callBack(false);
  });
}

async function createPrescription(data, params, callBack) {
  const { patient_id, prescription } = params;

  var sql = `
        INSERT INTO
            appointments (
                patient_id,
                prescription,
                created_by,
                created_at
            )
        VALUES (
            ${patient_id},
            "${prescription}",
            ${user_id},
            NOW()
        );
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(true);
    else callBack(false);
  });
}

module.exports = { createPrescription };
