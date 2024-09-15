var mod = require("./appointmentRequestsModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
const multer = require("../../helper/multer");
var getRes = require("../../helper/common").getResponse;

function getAppointmentRequests(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.getAppointmentRequests(data, req.query, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function getAppointmentRequestsPage(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.getAppointmentRequestsPage(data, req.query, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function createAppointmentRequests(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.createAppointmentRequests(data, req.body, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function deleteAppointmentRequests(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.deleteAppointmentRequests(data, req.params, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function changeAppointmentRequestsStatus(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.changeAppointmentRequestsStatus(data, req.body, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getAppointmentRequests,
  createAppointmentRequests,
  deleteAppointmentRequests,
  changeAppointmentRequestsStatus,
  getAppointmentRequestsPage
};
