var mod = require("./patientsModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
const multer = require("../../helper/multer");
var getRes = require("../../helper/common").getResponse;

function getFinanceType(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.getFinanceType((result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function createFinanceType(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.createFinanceType(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function updateFinanceType(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.updateFinanceType(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function deleteFinanceType(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.deleteFinanceType(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getFinanceType,
  createFinanceType,
  updateFinanceType,
  deleteFinanceType,
};
