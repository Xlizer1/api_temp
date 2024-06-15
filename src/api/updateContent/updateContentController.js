var mod = require("./updateContentModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

function createUpdateContent(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(95)) {
        mod.createUpdateContent(data, req, (result) => {
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

function deleteUpdateContent(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      // console.log(data)
      if (data.roles_id.includes(95)) {
        mod.deleteUpdateContent(data, req, (result) => {
          if (result && result.affectedRows)
            response(getRes(true, { message: msg.deleted }));
          else response(getRes(false, msg.error));
        });
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}

function updateUpdateContent(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(95)) {
        mod.updateUpdateContent(data, req, (result) => {
          if (result.msg) response(getRes(result.status, result.msg));
          else if (result && result.affectedRows)
            response(getRes(true, { message: msg.updated }));
          else response(getRes(false, msg.error));
        });
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}

function getUpdateContents(req, response) {
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
        var title = searchFields&&searchFields.title?searchFields.title:0;
      } catch (error) {
        var title = 0;
      }
      try {
        var version = searchFields&&searchFields.version?searchFields.version:0;
      } catch (error) {
        var version = 0;
      }
      try {
        var body = searchFields&&searchFields.body?searchFields.body:0;
      } catch (error) {
        var body = 0;
      }
      if (data.roles_id.includes(95)) {
        mod.getUpdateContents(
          {
            startDate,
            endDate,
            offset,
            itemsPerPage,
            title,
            version,
            body
          },
          (result) => {
            if (result) response(getRes(true, result));
            else response(getRes(false, msg.error));
          }
        );
      } else response(getRes(false, msg.failedGetUpdateData));
    } else response(getRes(false, msg.invalidToken));
  });
}
function getUpdateContentList(req, response) {
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
        var title = searchFields&&searchFields.title?searchFields.title:0;
      } catch (error) {
        var title = 0;
      }
      try {
        var version = searchFields&&searchFields.version?searchFields.version:0;
      } catch (error) {
        var version = 0;
      }
      try {
        var body = searchFields&&searchFields.body?searchFields.body:0;
      } catch (error) {
        var body = 0;
      }
      // if (data.roles_id.includes(95)) {
        mod.getUpdateContentList(
          {
            startDate,
            endDate,
            offset,
            itemsPerPage,
            title,
            version,
            body
          },
          (result) => {
            if (result) response(getRes(true, result));
            else response(getRes(false, msg.error));
          }
        );
      // } else response(getRes(false, msg.failedGetUpdateData));
    } else response(getRes(false, msg.invalidToken));
  });
}
function getUpdateContentListOfVersions(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
        mod.getUpdateContentListOfVersions(
          {},
          (result) => {
            if (result) response(getRes(true, result));
            else response(getRes(false, msg.error));
          }
        );
    } else response(getRes(false, msg.invalidToken));
  });
}

module.exports = {
  deleteUpdateContent,
  updateUpdateContent,
  createUpdateContent,
  getUpdateContentList,
  getUpdateContents,
  getUpdateContentListOfVersions
};
