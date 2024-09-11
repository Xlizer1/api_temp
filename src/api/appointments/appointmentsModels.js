const executeQuery = require("../../helper/common").executeQuery;

async function getAppointments(params, callBack) {
  const { date, patient_name, doc_id, statuses_id } = params;

  var sql = `
        SELECT
            a.*,
            u.name,
            u.birthdate as age
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

async function createAppointments(data, params, callBack) {
  const user_id = data?.user_id;
  const { patient_id, doc_id, condition, date } = params;

  var sql = `
        INSERT INTO
            appointments (
                patient_id,
                doc_id,
                patient_condition,
                date,
                created_by,
                created_at
            )
        VALUES (
            ${patient_id},
            ${doc_id},
            "${condition}",
            "${date}",
            ${user_id},
            NOW()
        );
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(true);
    else callBack(false);
  });
}

async function updateAppointments(data, params, callBack) {
  const user_id = data?.user_id;
  const { appo_id, patient_id, doc_id, condition, date } = params;
  var sql = `
        UPDATE
            appointments
        SET
            patient_id = ${patient_id},
            doc_id = ${doc_id},
            patient_condition = "${condition}",
            date = "${date}",
            updated_by = ${user_id},
            updated_at = NOW()
        WHERE
            id = ${appo_id};
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(true);
    else callBack(false);
  });
}

async function updateAppointmentsDone(data, params, callBack) {
  const { appo_id, status_id } = params;
  var sql = `
        UPDATE
            appointments
        SET
            status_id = ${status_id}
        WHERE
            id = ${appo_id};
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(true);
    else callBack(false);
  });
}

async function deleteAppointments(data, appo_id, callBack) {
  const user_id = data?.user_id;
  var sql = `
        UPDATE
            appointments
        SET
            deleted_by = ${user_id},
            deleted_at = NOW()
        WHERE
            id = ${appo_id};
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result && result.affectedRows) callBack(true);
    else callBack(false);
  });
}

module.exports = {
  getAppointments,
  createAppointments,
  updateAppointments,
  deleteAppointments,
  updateAppointmentsDone,
};
