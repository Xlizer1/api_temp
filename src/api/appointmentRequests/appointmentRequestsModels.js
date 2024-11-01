const twilio = require("twilio");

var executeQuery = require("../../helper/common").executeQuery;
const {
  sendAppointmentRequestsCreateNotification
} = require("../../config/pusher");

const accountSid = process.env.ACCSID; // Replace with your Account SID
const authToken = process.env.AUTHTOKEN; // Replace with your Auth Token

const client = new twilio(accountSid, authToken);

async function getAppointmentRequests(data, params, callBack) {
  const user_id = data?.user_id;
  const user_department_id = data?.user_department_id;
  const { itemsPerPage, offset } = params;

  let selectTotal = `SELECT count(ar.id) as total_rows`;

  var selectSql = `
          SELECT
              ar.*,
              u.name,
              ars.id as status_id,
              ars.name as status
  `;
  var sql = `
          FROM
              appointments_requests ar
          LEFT JOIN
              users u on u.user_id = ar.created_by
          LEFT JOIN
              appointments_requests_statuses ars on ars.id = ar.status_id
          WHERE
              ar.created_by = ${user_id}
  `;

  executeQuery(selectTotal + sql, "getAppointmentRequests", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    // let paginationSQL = ` ORDER BY ar.created_at DESC LIMIT ${
    //   offset * itemsPerPage
    // }, ${itemsPerPage}`;
    let paginationSQL = ` ORDER BY ar.created_at DESC`;
    executeQuery(
      selectSql + sql + paginationSQL,
      "getAppointmentRequests",
      (result) => {
        if (result) {
          callBack({ total: totalRows, data: result });
        } else callBack(false);
      }
    );
  });
}

async function getAppointmentRequestsPage(data, params, callBack) {
  const user_id = data?.user_id;
  const user_department_id = data?.user_department_id;
  const { itemsPerPage, offset } = params;

  let selectTotal = `SELECT count(ar.id) as total_rows`;

  var selectSql = `
          SELECT
              ar.*,
              u.name,
              u.phone,
              ars.id as status_id,
              ars.name as status
  `;
  var sql = `
          FROM
              appointments_requests ar
          LEFT JOIN
              users u on u.user_id = ar.created_by
          LEFT JOIN
              appointments_requests_statuses ars on ars.id = ar.status_id
  `;

  executeQuery(selectTotal + sql, "getAppointmentRequests", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    let paginationSQL = ` ORDER BY ar.created_at DESC LIMIT ${
      offset * itemsPerPage
    }, ${itemsPerPage}`;
    executeQuery(
      selectSql + sql + paginationSQL,
      "getAppointmentRequests",
      (result) => {
        if (result) {
          callBack({ total: totalRows, data: result });
        } else callBack(false);
      }
    );
  });
}

async function createAppointmentRequests(data, params, callBack) {
  const user_id = data?.user_id;
  const { request_description, date } = params;

  var sql = `
        INSERT INTO
            appointments_requests (
                status_id,
                description,
                date,
                created_by,
                created_at
            )
        VALUES (
            1,
            "${request_description}",
            "${date}",
            ${user_id},
            NOW()
        );
  `;

  executeQuery(sql, "getAppointments", (result) => {
    if (result) {
      sendAppointmentRequestsCreateNotification({
        message: "New Appointment Request created",
        name: data?.name,
      });
      callBack(true);
    } else callBack(false);
  });
}

async function deleteAppointmentRequests(data, params, callBack) {
  const { id } = params;

  var sql = `
      DELETE FROM appointments_requests
      WHERE
        id = ${id}
  `;

  executeQuery(sql, "getAppointments", (result) => {
    if (result) {
      callBack(true);
    } else callBack(false);
  });
}

async function changeAppointmentRequestsStatus(data, params, callBack) {
  const { id, status_id, note, phone } = params;

  var sql = `
      UPDATE appointments_requests SET status_id = ${status_id}, approval_note = "${note}"
      WHERE appointments_requests.id = ${id}
  `;
  executeQuery(sql, "getAppointments", (result) => {
    if (result) {
      client.messages
        .create({
          body: status_id === 2 ? "Your request has been accepted: " + note : "Your request has been rejected: " + note,
          to: phone, // Replace with your phone number (must be verified in Twilio)
          from: "+14402524901", // Replace with your Twilio number
        })
        .then((message) => console.log("Message sent successfully: " + message.sid))
        .catch((error) => console.log("Error sending message: ", error));
      callBack(true);
    } else callBack(false);
  });
}

module.exports = {
  getAppointmentRequests,
  createAppointmentRequests,
  deleteAppointmentRequests,
  changeAppointmentRequestsStatus,
  getAppointmentRequestsPage
};
