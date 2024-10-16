const executeQuery = require("../../helper/common").executeQuery;
const { sendAppointmentCreateNotification } = require("../../config/pusher");

async function getAppointments(data, params, callBack) {
  const { user_id, user_department_id } = data;
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

  if(user_department_id === 4) {
    sql += ` AND a.doc_id = '${user_id}'`;
  }

  if (doc_id) {
    sql += ` AND a.doc_id = '${doc_id}'`;
  }

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
  if (await isPatientsNumberPerDayExceeded(doc_id, date)) {
    callBack({
      message:
        "Maximum number of patients for the date " +
        date +
        " has exceeded please increase the number of patients or assign the appointment for an other date",
    });
    return;
  }

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
    if (result) {
      sendAppointmentCreateNotification({
        message: "New appointment has been created",
        name: data?.name,
        doc_id: doc_id,
        patient_id: patient_id,
      });
      callBack(true);
    } else callBack(false);
  });
}

async function isPatientsNumberPerDayExceeded(doc_id, date) {
  return new Promise((resolve, reject) => {
    try {
      var sql = `
        SELECT
            COUNT(a.id) AS patients_count
        FROM
            appointments a
        WHERE
            a.date BETWEEN "${date} 00:00:00" AND "${date} 23:59:59"
        AND
            a.doc_id = ${doc_id}
      `;

      executeQuery(sql, "patientsCount", (result) => {
        const patientsCount = result[0].patients_count;
        var sql2 = `
          SELECT
              u.patients_per_day
          FROM
              users u
          WHERE
              u.user_id = ${doc_id}
        `;
        executeQuery(sql2, "patientsPerDay", (result2) => {
          const patientsPerDay = result2[0].patients_per_day;
          console.log(patientsCount >= patientsPerDay, date);
          if (patientsCount > patientsPerDay) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    } catch (error) {
      reject(false);
      console.log(
        "Error in the function isPatientsNumberPerDayExceeded: ",
        error
      );
    }
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
