var mod = require("./UserImageModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
var depModel = require("../departments/depModels");
const {
  addHoursToDateString,
  getDayOfWeekFromDate,
  getDateTime,
  addDaysToDateString,
} = require("../../helper/common");
const messages = require("../../helper/messages");
var getRes = require("../../helper/common").getResponse;

function getUserImages(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {

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

      mod.getUserImages(
        {
          user_id: data.user_id,
          user_department_id: data.user_department_id,
          roles_id: data.roles_id,
          offset,
          itemsPerPage,
        },
        (result) => {
          response(getRes(true, result));
        }
      );
    } else if (!data)
      response({ status: false, data: { message: msg.invalidToken } });
    else response({ status: false, data: { message: msg.error } });
  });
}
function getUserImagesList(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try{
        var user_id=req&&req?.query&&req?.query?.user_id?req?.query?.user_id:0
      }catch(err){
        var user_id=0
      }
      try{
        var is_normalUser=req&&req?.query&&req?.query?.is_normalUser?req?.query?.is_normalUser:0
      }catch(err){
        var is_normalUser=0
      }
      let final_user_id=data?.user_id
      if(is_normalUser){
        final_user_id=user_id
      }
      mod.getUserImagesList(
        {
          user_id: final_user_id,
          user_department_id: data.user_department_id,
          roles_id: data.roles_id,
        },
        (result) => {
          response(getRes(true, result));
        }
      );
    } else if (!data)
      response({ status: false, data: { message: msg.invalidToken } });
    else response({ status: false, data: { message: msg.error } });
  });
}
function createUserImage(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var file = req.file;
      } catch (err) {
        var file = null;
      }
      try {
        var user_id = req&&req?.body&&req?.body?.user_id?parseInt(req?.body?.user_id):0;
      } catch (err) {
        var user_id = 0;
      }
      try {
        var is_normalUser = req&&req?.body&&req?.body?.is_normalUser?parseInt(req?.body?.is_normalUser):0;
      } catch (err) {
        var is_normalUser = 0;
      }
      var finalUserId=0
      if(is_normalUser){
        finalUserId=user_id;
      }else{
        finalUserId=data?.user_id;
      }
      if (!file) {
        return response(getRes(false, messages.userImageRequired));
      }
      if(!finalUserId){
        return response(getRes(false, messages.userIdRequired));
      }

      //console.log("entered here.------------------");
      mod.createUserImage(
        {
          user_id: finalUserId,
          file: file,
        },
        (result) => {
          if (result) response(getRes(true, messages.inserted));
          else response(getRes(false, messages.error));
        }
      );
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}
function updateUserImage(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var user_image_id = req.params.user_image_id;
      } catch (err) {
        user_image_id = 0;
      }
      try {
        var user_id = req&&req?.body&&req?.body?.user_id?parseInt(req?.body?.user_id):0;
      } catch (err) {
        var user_id = 0;
      }
      try {
        var is_normalUser = req&&req?.body&&req?.body?.is_normalUser?parseInt(req?.body?.is_normalUser):0;
      } catch (err) {
        var is_normalUser = 0;
      }
      var finalUserId=0
      if(is_normalUser){
        finalUserId=user_id;
      }else{
        finalUserId=data?.user_id;
      }
      //console.log("entered here.------------------");
      mod.updateUserImage(
        {
          user_id: finalUserId,
          user_image_id: user_image_id,
        },
        (result) => {
          response(getRes(true, messages.updated));
        }
      );
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}
function deletedUserImage(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var user_image_id = req.params.user_image_id;
      } catch (err) {
        user_image_id = 0;
      }
  
      //console.log("entered here.------------------");
      mod.deletedUserImage(
        {
          user_id: data.user_id,
          user_image_id: user_image_id,
        },
        (result) => {
          response(getRes(true, messages.deleted));
        }
      );
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}

module.exports = {
  createUserImage,
  updateUserImage,
  deletedUserImage,
  getUserImages,
  getUserImagesList
};
