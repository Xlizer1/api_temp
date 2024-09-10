var executeQuery = require("../../helper/common").executeQuery;
const { sendPrescriptionCreateNotification, sendPrescriptionStatusChangeNotification, sendPrescriptionUpdateNotification } = require("../../config/pusher");

async function getPrescription(data, params, callBack) {
  const user_id = data?.user_id;
  const user_department_id = data?.user_department_id;
  const { name, itemsPerPage, offset } = params;

  let selectTotal = `SELECT count(p.id) as total_rows`;

  var selectSql = `
          SELECT
              p.*,
              u.name,
              u.birthdate AS age,
              ps.name AS status
  `;
  var sql = `
          FROM
              prescription p
          LEFT JOIN
              users u on u.user_id = p.patient_id
          LEFT JOIN
              prescription_statuses ps on ps.id = p.status_id
  `;

  if (user_department_id === 5) {
    sql += `WHERE 1=1`;
  } else {
    sql += `
        WHERE
            p.created_by = ${user_id} OR p.patient_id = ${user_id}
    `;
  }

  if (name) {
    sql += ` AND u.name LIKE "%${name}%"`;
  }

  executeQuery(selectTotal + sql, "getPrescription", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    let paginationSQL = ` ORDER BY p.created_at DESC LIMIT ${offset * itemsPerPage
      }, ${itemsPerPage}`;
    executeQuery(
      selectSql + sql + paginationSQL,
      "getPrescription",
      (result) => {
        if (result) {
          callBack({ total: totalRows, data: result });
        } else callBack(false);
      }
    );
  });
}

async function createPrescription(data, params, callBack) {
  const user_id = data?.user_id;
  const { patient_id, prescription } = params;

  var sql = `
        INSERT INTO
            prescription (
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
    if (result) {
      sendPrescriptionCreateNotification({
        message: "New prescription created",
        name: data?.name,
      });
      callBack(true);
    } else callBack(false);
  });
}

async function updatePrescription(data, params, callBack) {
  const { patient_id, prescription_id, prescription, pharmacist_note } = params;

  var sql = `
      UPDATE prescription
      SET
        patient_id = "${patient_id}",
        prescription = "${prescription}",
        note = "${pharmacist_note}"
      WHERE
        id = ${prescription_id}
  `;

  executeQuery(sql, "getAppointments", (result) => {
    if (result) {
      sendPrescriptionUpdateNotification({
        message: "Updated prescription",
        name: data?.name,
      });
      callBack(true);
    } else callBack(false);
  });
}

async function changePrescriptionStatus(data, params, callBack) {
  const { prescription_id, status_id } = params;

  var sql = `
      UPDATE prescription SET status_id = ${status_id}
      WHERE prescription.id = ${prescription_id}
  `;

  executeQuery(sql, "getAppointments", (result) => {
    if (result) {
      sendPrescriptionStatusChangeNotification({
        message: "Updated prescription status",
        name: data?.name,
      });
      callBack(true);
    } else callBack(false);
  });
}

module.exports = { getPrescription, createPrescription, updatePrescription, changePrescriptionStatus };
