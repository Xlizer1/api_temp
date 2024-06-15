var mod = require("./userGroupModels");
var msg = require("../../helper/messages");
var auth = require("../../jwt/auth");
var getRes = require("../../helper/common").getResponse;

function createUserGroups(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      if (data.roles_id.includes(89)) {
        try {
          var user_id =
            req && req?.body && req?.body?.user_id ? req?.body?.user_id : 0;
        } catch (e) {
          var user_id = 0;
        }
        try {
          var group_ids =
            req && req?.body && req?.body?.group_ids ? req?.body?.group_ids : [];
        } catch (e) {
          var group_ids = [];
        }
        let erroMessages=''
        if(!user_id){
          erroMessages+='user identifier required' 
        }
        // if(group_ids?.length<=0){
        //   if(erroMessages?.length>0){
        //     erroMessages+=', you must also specify the groups for this user'
        //   }else{
        //     erroMessages+='you must specify the groups for this user'
        //   }
        // }
        if(erroMessages?.length>0){
         return response(getRes(false, erroMessages));
        }

        mod.createUserGroups(
          {
            ...data,
            assigend_user_id:user_id,
            group_ids
          },
          (result) => {
            if (result && result.affectedRows>0)
              response(
                getRes(true,  msg.inserted)
              );
            else if(result&&typeof result=='boolean') response(getRes(true, msg.inserted));
            else response(getRes(false, msg.error));
          }
        );
      } else response(getRes(false, msg.failedCreate));
    } else response(getRes(false, msg.invalidToken));
  });
}
function getUserGroups(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var user_id =
          req && req?.params && req?.parmas?.user_id
            ? req?.parmas?.user_id
            : 0;
      } catch (e) {
        var user_id = 0;
      }
      mod.getUserGroups(
        {
          ...data,
          assigned_user_id:user_id,
        },
        (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, msg.error));
        }
      );
    } else response(getRes(false, msg.invalidToken));
  });
}
function getUserGroupsById(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      try {
        var user_id =
          req && req?.params && req?.params?.user_id
            ? req?.params?.user_id
            : 0;
      } catch (e) {
        var user_id = 0;
      }
      mod.getUserGroupsById(
        {
          ...data,
          assigned_user_id:user_id,
        },
        (result) => {
          if (result) response(getRes(true, result));
          else response(getRes(false, msg.error));
        }
      );
    } else response(getRes(false, msg.invalidToken));
  });
}

module.exports = {
  createUserGroups,
  getUserGroups,
  getUserGroupsById
};
