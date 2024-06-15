var mod = require("./groupModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

function createGroup(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(87)) {
        mod.createGroup(data, req, (result) => {
          if (result && result.insertId)
            response(
              getRes(true, { message: msg.inserted, id: result.insertId })
            );
          else response(getRes(false, msg.error));
        });
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}

function deleteGroup(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      // console.log(data)
      if (data.roles_id.includes(87)) {
        mod.deleteGroup(data, req, (result) => {
          if (result && result.affectedRows)
            response(getRes(true, { message: msg.deleted }));
          else response(getRes(false, msg.error));
        });
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}

function updateGroup(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(87)) {
        mod.updateGroup(data, req, (result) => {
          if (result.msg) response(getRes(result.status, result.msg));
          else if (result && result.affectedRows)
            response(getRes(true, { message: msg.updated }));
          else response(getRes(false, msg.error));
        });
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}

function getGroups(req, response) {
  // console.log(req.header['jwt'])
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var searchFields = JSON.parse(req.query.params).searchFields;
      } catch (error) {
        var searchFields = {};
      }
      try {
        var startDate = searchFields?.startDate ? searchFields?.startDate : null;
      } catch (e) {
        var startDate = null;
      }

      try {
        var endDate = searchFields?.endDate ? searchFields?.endDate : null;
        // console.log("searchFields.endDate", searchFields.endDate);
      } catch (e) {
        var endDate = null;
      }
      try {
        var offset = JSON.parse(req.query.params).offset;
      } catch (error) {
        var offset = 0;
      }
      try {
        var itemsPerPage = JSON.parse(req.query.params).itemsPerPage;
      } catch (error) {
        var itemsPerPage = 10;
      }
      try {
        var name = searchFields?.name ? searchFields?.name:false;
      } catch (error) {
        var name = false;
      }
      if (data.roles_id.includes(86)) {
        mod.getGroups(
          {
            startDate,
            endDate,
            offset,
            itemsPerPage,
            name
          },
          (result) => {
            if (result) response(getRes(true, result));
            else response(getRes(false, msg.error));
          }
        );
      } else response(getRes(false, msg.faildGetGroupData));
    } else response(getRes(false, msg.invalidToken));
  });
}
function getGroupsList(req, response) {
  // console.log(req.header['jwt'])
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var searchFields = JSON.parse(req.query.params).searchFields;
      } catch (error) {
        var searchFields = {};
      }
      try {
        var startDate = searchFields.startDate ? searchFields.startDate : null;
      } catch (e) {
        var startDate = null;
      }

      try {
        var endDate = searchFields.endDate ? searchFields.endDate : null;
        // console.log("searchFields.endDate", searchFields.endDate);
      } catch (e) {
        var endDate = null;
      }
      try {
        var offset = JSON.parse(req.query.params).offset;
      } catch (error) {
        var offset = 0;
      }
      try {
        var itemsPerPage = JSON.parse(req.query.params).itemsPerPage;
      } catch (error) {
        var itemsPerPage = 10;
      }
      try {
        var name = req?.query?.params&&JSON.parse(req.query.params).name?JSON.parse(req.query.params).name:0;
      } catch (error) {
        var name = 0;
      }
      if (data.roles_id.includes(86)) {
        mod.getGroupList(
          {
            startDate,
            endDate,
            offset,
            itemsPerPage,
            name,
          },
          (result) => {
            if (result) response(getRes(true, result));
            else response(getRes(false, msg.error));
          }
        );
      } else response(getRes(false, msg.faildGetGroupData));
    } else response(getRes(false, msg.invalidToken));
  });
}

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  getGroupsList,
};
