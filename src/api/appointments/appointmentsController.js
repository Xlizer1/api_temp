var mod = require("./appointmentsModels");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

async function getAppointments(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.query;
        mod.getAppointments(data, params, (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}
async function getAllAppointments(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.query;
        mod.getAllAppointments(data, params, (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

async function createAppointments(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.body;
        mod.createAppointments(data, params, (result) => {
          if (result)
            response(
              getRes(true, {
                message: msg.inserted,
                data: result,
              })
            );
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

async function updateAppointments(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.body;
        const appo_id = req.params.appo_id;
        mod.updateAppointments(data, { ...params, appo_id }, (result) => {
          if (result)
            response(
              getRes(true, {
                message: msg.inserted,
                data: result,
              })
            );
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

async function updateAppointmentsDone(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        const params = req.body;
        const appo_id = req.params.appo_id;
        mod.updateAppointmentsDone(data, { ...params, appo_id }, (result) => {
          if (result)
            response(
              getRes(true, {
                message: "Updated!",
              })
            );
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

async function deleteAppointments(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      const appo_id = req.params.appo_id;
      mod.deleteAppointments(data, appo_id, (result) => {
        if (result)
          response(
            getRes(true, {
              message: msg.inserted,
              data: result,
            })
          );
        else response(getRes(false, null, msg.error));
      });
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getAppointments,
  getAllAppointments,
  createAppointments,
  updateAppointments,
  deleteAppointments,
  updateAppointmentsDone,
};
