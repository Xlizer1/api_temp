var executeQuery = require("../../helper/common").executeQuery;
const { sendPrescriptionCreateNotification } = require("../../config/pusher");

async function getPrescription(data, params, callBack) {
  const user_id = data?.user_id;
  const user_department_id = data?.user_department_id;
  const { name, itemsPerPage, offset } = params;

  console.log(itemsPerPage, offset);

  let selectTotal = `SELECT count(p.id) as total_rows`;

  var selectSql = `
          SELECT
              p.*,
              u.name,
              u.birthdate as age
  `;
  var sql = `
          FROM
              prescription p
          LEFT JOIN
              users u on u.user_id = p.patient_id
  `;

  if (user_department_id === 5) {
    sql += `WHERE 1=1`;
  } else {
    sql += `
        WHERE
            p.created_by = ${user_id}
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
    console.log(totalRows);
    let paginationSQL = ` ORDER BY p.created_at DESC LIMIT ${
      offset * itemsPerPage
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
        message: "New Prescription Created",
        name: data?.name,
      });
      callBack(true);
    } else callBack(false);
  });
}

module.exports = { getPrescription, createPrescription };
