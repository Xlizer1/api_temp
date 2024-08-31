var executeQuery = require("../../helper/common").executeQuery;

async function getPrescription(params, callBack) {
  const { patient_name, itemsPerPage, offset } = params;

  let selectTotal = `SELECT count(*) as total_rows`;

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

  if (patient_name) {
    sql += ` AND u.name LIKE "%${patient_name}%"`;
  }

  executeQuery(selectTotal + sql, "getPrescription", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    let paginationSQL = ` ORDER BY p.created_at LIMIT ${offset * itemsPerPage}, ${itemsPerPage}`;
    executeQuery(selectSql + sql + paginationSQL, "getPrescription", (result) => {
      if (result) {
        callBack({ total: totalRows, data: result });
      } else callBack(false);
    });
  });
}

async function createPrescription(data, params, callBack) {
  const user_id = data?.user_id;
  const { patient_id, prescription, appointment_id } = params;

  var sql = `
        INSERT INTO
            prescription (
                patient_id,
                prescription,
                appointment_id,
                created_by,
                created_at
            )
        VALUES (
            ${patient_id},
            "${prescription}",
            ${appointment_id},
            ${user_id},
            NOW()
        );
    `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) callBack(true);
    else callBack(false);
  });
}

module.exports = { getPrescription, createPrescription };
