var executeQuery = require("../../helper/common").executeQuery;
const {
  sendPrescriptionCreateNotification,
  sendPrescriptionStatusChangeNotification,
  sendPrescriptionUpdateNotification,
} = require("../../config/pusher");

async function getPrescription(data, params, callBack) {
  const user_department_id = data?.user_department_id;
  const { name, user_id, itemsPerPage, offset } = params;

  let selectTotal = `SELECT count(p.id) as total_rows`;

  var selectSql = `
          SELECT
              p.*,
              u.name,
              doc.name AS doc_name,
              u.birthdate AS age,
              ps.name AS status
  `;
  var sql = `
          FROM
              prescription p
          LEFT JOIN
              users u on u.user_id = p.patient_id
          LEFT JOIN
              users doc on doc.user_id = p.created_by
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
    let paginationSQL = ` ORDER BY p.created_at DESC LIMIT ${
      offset * itemsPerPage
    }, ${itemsPerPage}`;
    executeQuery(
      selectSql + sql + paginationSQL,
      "getPrescription",
      async (result) => {
        if (result) {
          const updatedResult = await Promise.all(
            result.map(async (prescription) => {
              const sqlRequestFinances = `
                SELECT 
                    *
                FROM
                    prescription_details
                WHERE
                    p_id = ${prescription.id}
              `;

              let requestFinancesResult = await new Promise((resolve) => {
                executeQuery(
                  sqlRequestFinances,
                  "getTaskStatus",
                  (prescriptionDetails) => {
                    if (prescriptionDetails.length && prescriptionDetails[0]) {
                      resolve(prescriptionDetails);
                    } else {
                      resolve([]);
                    }
                  }
                );
              });

              return {
                ...prescription,
                arr: requestFinancesResult,
              };
            })
          );

          // Once all asynchronous operations are done, call the callback
          callBack({ total: totalRows, data: updatedResult });
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
      callBack(result?.insertId);
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

async function insertTaskFinances(data, p_id, prescription_details, callback) {
  if (p_id && prescription_details && prescription_details?.length) {
    var detailsInsertedSuccessfully = true;
    for (let i = 0; i < prescription_details.length; i++) {
      const prescription_detail = prescription_details[i];
      let medicine_name = prescription_detail?.medicine_name
        ? prescription_detail?.medicine_name
        : "";
      let dose = prescription_detail?.dose ? prescription_detail?.dose : 0;
      let note = prescription_detail?.note ? prescription_detail?.note : "";
      let provided = prescription_detail?.provided ? 1 : 0;
      let sql = `
              INSERT INTO
                  prescription_details (
                      p_id,
                      medicine_name,
                      dose,
                      note,
                      provided
                  )
              VALUES (
                  ${p_id},
                  ${medicine_name},
                  ${dose},
                  "${note}",
                  ${provided}
              )
          `;
      executeQuery(sql, "insertTaskDetails #" + p_id, (result) => {
        if (result[0] === false) detailsInsertedSuccessfully = false;
      });
    }
    if (detailsInsertedSuccessfully) callback(true);
    else callback(false);
  } else {
    callback(false);
  }
}

async function updateTaskFinances(data, p_id, prescription_details, callback) {
  let removeOldDetailsSql = `
          DELETE FROM prescription_details WHERE p_id = ${p_id}
      `;
  executeQuery(
    removeOldDetailsSql,
    "removeOldDetailsSql #" + p_id,
    (res) => res
  );

  if (p_id && prescription_details && prescription_details?.length) {
    var detailsInsertedSuccessfully = true;
    for (let i = 0; i < prescription_details.length; i++) {
      const prescription_detail = prescription_details[i];
      let medicine_name = prescription_detail?.medicine_name
        ? prescription_detail?.medicine_name
        : "";
      let dose = prescription_detail?.dose ? prescription_detail?.dose : 0;
      let note = prescription_detail?.note ? prescription_detail?.note : "";
      let provided = prescription_detail?.provided ? 1 : 0;
      let sql = `
              INSERT INTO
                  prescription_details (
                      p_id,
                      medicine_name,
                      dose,
                      note,
                      provided
                  )
              VALUES (
                  ${p_id},
                  "${medicine_name}",
                  ${dose},
                  "${note}",
                  ${provided}
              )
          `;
      executeQuery(sql, "insertTaskDetails #" + p_id, (result) => {
        if (result[0] === false) detailsInsertedSuccessfully = false;
      });
    }
    if (detailsInsertedSuccessfully) callback(true);
    else callback(false);
  } else {
    callback(false);
  }
}

module.exports = {
  getPrescription,
  createPrescription,
  updatePrescription,
  changePrescriptionStatus,
  insertTaskFinances,
  updateTaskFinances,
};
