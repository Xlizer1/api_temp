var mod = require("./deviceStatusesModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
const multer = require("../../helper/multer");
var getRes = require("../../helper/common").getResponse;

function getFinanceTaskDetails(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.getFinanceTaskDetails((result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function createFinanceTaskDetails(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.createFinanceTaskDetails(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function updateFinanceTaskDetails(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.updateFinanceTaskDetails(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function deleteFinanceTaskDetails(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(5)) {
        mod.deleteFinanceTaskDetails(data, req, (result) => {
          if (result)
            response(getRes(true, { message: msg.inserted, data: result }));
          else response(getRes(false, null, msg.error));
        });
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

module.exports = {
  getFinanceTaskDetails,
  createFinanceTaskDetails,
  updateFinanceTaskDetails,
  deleteFinanceTaskDetails,
};
