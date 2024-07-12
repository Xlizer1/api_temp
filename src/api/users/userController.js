
var mod = require('./userModels')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
var depModel = require('../departments/depModels')
var getRes = require('../../helper/common').getResponse
const getDateTime = require("../../helper/common").getDateTime;

function createUsers(req,response){
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            if(data.roles_id.includes(1)){ // check permission of create user
                var user={
                    username: req.body.username,
                    password: req.body.password,
                    name: req.body.name,
                    email: req.body.email,
                    depId: req.body.department_id,
                    phone: req.body.phone,
                    ip_phone: req.body.ip_phone,
                    birthdate: req.body.birthdate,
                    telegram_username: req.body.telegram_username,
                    default_route: req.body.default_route,
                    allow_send_emails:req?.body?.allow_send_emails?req.body.allow_send_emails:0,
                    is_group_base_role:req?.body?.is_group_base_role?req.body.is_group_base_role:0,
                    telegram_id: req?.body?.telegram_id?req?.body?.telegram_id:null
                } 
                    //check if username existed
                    mod.checkUsernameOrIdExisting(user.username,null, existed=>{
                        if(!existed)  {
                            mod.checkDepartmentId(user.depId, existed=>{
                                if(!existed) response({status: false, data:{message: msg.depIdNotExist}})
                                else {
                                    mod.insertUser(data.user_id,user, result =>{
                                        if(result) response({status: true, 
                                                                data:{
                                                                        message: msg.inserted,
                                                                        user_id: result[1].insertId
                                                                    }
                                                            });
                                        else response({status: false, data:{message: msg.error}});
                                    })
                                }
                            })
                        }
                        else response({status: false, data:{message: msg.userExist}});
                    })
            }else response({status: false, data:{message: msg.failedCreateUser}})
        }else response({status: false, data:{message: msg.invalidToken}})
    })
}

function updateUser(req,response){
    // check autherization
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var haveRole = data.roles_id.includes(2) 
                            || (!data.roles_id.includes(2) && req.params.user_id == data.user_id);

            if(haveRole){
                mod.checkUsernameOrIdExisting(null,req.params.user_id, existed=>{
                    if(existed)  {
                        mod.updateUserDetails(data,req,result=>{
                            if(result) {
                                // //console.log(result)
                                if(result.changedRows >0) response(getRes(true,null,msg.updated))
                                else response(getRes(true,null,msg.noThingUpdate))
                            }
                            else response(getRes(false,null,msg.error))
                        })
                    }else response(getRes(false,null,msg.userNotFound))
                })
            }
            else response(getRes(false,null,msg.unauthorized))
        }else response({status: false, data:{message: msg.invalidToken}})
})
}

function enableUser(req,response){
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var haveRole = data.roles_id.includes(2) 
            if(haveRole){
                mod.checkUsernameOrIdExisting(null,req.params.user_id, existed=>{
                    if(existed)  {
                        mod.enableUser(data,req,result=>{
                            if(result) {
                                if(result.changedRows >0) response(getRes(true,null,msg.updated))
                                else response(getRes(true,null,msg.noThingUpdate))
                            }
                            else response(getRes(false,null,msg.error))
                        })
                    }else response(getRes(false,null,msg.userNotFound))
                })
            }
            else response(getRes(false,null,msg.unauthorized))
        }else response({status: false, data:{message: msg.invalidToken}})
})
}


function getUsers(allUsers,req,response){
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var user_id = allUsers ? null : req.params.user_id
            var haveRole = data.roles_id.includes(1) || data.roles_id.includes(2)
            try {
                var searchFields = JSON.parse(req.query.params).searchFields;
            } catch (error) {
                var searchFields = {};
            }
            try {
                var startDate = searchFields.startDate
                  ? searchFields.startDate
                  : null;
            } catch (e) {
                var startDate = null;
            }
        
            try {
                var endDate = searchFields.endDate
                  ? searchFields.endDate
                  :null;
                // //console.log("searchFields.endDate", searchFields.endDate);
            } catch (e) {
                var endDate = null
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
                var name = searchFields.name;
              } catch (error) {
                var name = '';
            } 
            try {
                var username = searchFields.username;
              } catch (error) {
                var username = '';
            } 
            try {
                var accountname = searchFields.accountname;
              } catch (error) {
                var accountname = '';
            } 
            try {
                var phone = searchFields.phone;
              } catch (error) {
                var phone = '';
            } 
            try {
                var email = searchFields.email;
              } catch (error) {
                var email = '';
            } 
            try {
                var is_internal_or_external = searchFields?.is_internal_or_external?searchFields?.is_internal_or_external:0;
              } catch (error) {
                var is_internal_or_external = 0;
            } 
            try {
                var department_id = searchFields.department_id;
              } catch (error) {
                var department_id = 0;
            } 
            try {
                var active_status = searchFields.active_status;
              } catch (error) {
                var active_status = 0;
            } 

            console.log(searchFields)
            
            depModel.getDepartments(false, departments=>{
                    if(departments) {
                        mod.sortDepartments(departments, sortedDeps=>{
                            mod.getUsers(haveRole,user_id,sortedDeps,
                                {
                                    offset,
                                    itemsPerPage,
                                    name,
                                    username,
                                    email,
                                    phone,
                                    accountname,
                                    startDate,
                                    endDate,
                                    is_internal_or_external,
                                    department_id,
                                    active_status
                                }
                                ,result=>{
                                 response({status: true, data: result})
                             })
                        })
                    }
                    else response({status: false, data:{message: msg.error}})
            })
        }
        else if(!data) response({status: false, data:{message: msg.invalidToken}})
        else response({status: false, data:{message: msg.error}})
    })
}
function getUsersReport(allUsers,req,response){
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var user_id = allUsers ? null : req.params.user_id
            var haveRole = data.roles_id.includes(1) || data.roles_id.includes(2)

            try {
                var searchFields = JSON.parse(req.query.params).searchFields;
            } catch (error) {
                var searchFields = {};
            }
            try {
                var startDate = searchFields.startDate
                  ? searchFields.startDate
                  : null;
            } catch (e) {
                var startDate = null;
            }
        
            try {
                var endDate = searchFields.endDate
                  ? searchFields.endDate
                  :null;
                // //console.log("searchFields.endDate", searchFields.endDate);
            } catch (e) {
                var endDate = null
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
                var name = searchFields.name;
              } catch (error) {
                var name = '';
            } 
            try {
                var username = searchFields.username;
              } catch (error) {
                var username = '';
            } 
            try {
                var accountname = searchFields.accountname;
              } catch (error) {
                var accountname = '';
            } 
            try {
                var phone = searchFields.phone;
              } catch (error) {
                var phone = '';
            } 
            try {
                var email = searchFields.email;
              } catch (error) {
                var email = '';
            } 
            try {
                var is_internal_or_external = searchFields.is_internal_or_external;
              } catch (error) {
                var is_internal_or_external = 0;
            } 
            var filterExport = null;
            try {
              filterExport = JSON.parse(req.query.params).filterExport;
            } catch (e) {
              filterExport = null;
            }
            
            depModel.getDepartments(false, departments=>{
                    if(departments) {
                        mod.sortDepartments(departments, sortedDeps=>{
                            mod.getUsersReport(haveRole,user_id,sortedDeps,
                                {
                                    offset,
                                    itemsPerPage,
                                    name,
                                    username,
                                    email,
                                    phone,
                                    accountname,
                                    startDate,
                                    endDate,
                                    is_internal_or_external,
                                    filterExport:filterExport,
                                    user_id:data.user_id

                                }
                                ,result=>{
                                 response({status: true, data: result})
                             })
                        })
                    }
                    else response({status: false, data:{message: msg.error}})
            })
        }
        else if(!data) response({status: false, data:{message: msg.invalidToken}})
        else response({status: false, data:{message: msg.error}})
    })
}
function downloadUsers(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var user_id = data.user_id
            const fileName = JSON.parse(req.query.params).fileName
            var isPdf = false;
            try {
              isPdf = JSON.parse(req.query.params).is_pdf == 1 ? true : false;
            } catch (err) {
              isPdf = false;
            }
            const file_user_id = fileName.split("user_id");
            if (file_user_id.length > 1 && file_user_id[1] == user_id) {
                ////console.log(__dirname);
                var excel_file_path =
                __dirname +
                (isPdf
                    ? "/../../../dist/uploads/temp/pdf_reports/"
                    : "/../../../dist/uploads/temp/excel_reports/") +
                fileName +
                (isPdf ? ".pdf" : ".xlsx");

                //response.download(excel_file_path); // Set disposition and send it.
                response(getRes(true, excel_file_path))
            }
            else {
                response(getRes(false, null, msg.unauthorized))
            }





        } else response(getRes(false, null, msg.invalidToken))
    })
}

function getUsersList(req,response){
    auth.verify(req.headers['jwt'], data => {
        if (data) {
          
            var haveRole = data.roles_id.includes(1) || data.roles_id.includes(2)
            try{
                var department_id = (req?.query && req?.query?.department_id)?req?.query?.department_id:0
            }catch(err){
                var department_id = 0
            }
            try{
                var has_telegram_id = (req?.query && req?.query?.has_telegram_id)?req?.query?.has_telegram_id:0
            }catch(err){
                var has_telegram_id = 0
            }

            try{
              var is_engineer=req&&req?.query&&req?.query?.is_engineer?req?.query?.is_engineer:0
            }catch(err){
                var is_engineer=0
            }
            try{
              var enabled=req&&req?.query&&req?.query?.enabled?req?.query?.enabled:0
            }catch(err){
                var enabled=0
            }
           
            mod.getUsersList({
                haveRole:haveRole,
                department_id:department_id,
                is_engineer:is_engineer,
                enabled:enabled,
                has_telegram_id
            },result=>{
                    response({status: true, data: result})
            })

        }
        else if(!data) response({status: false, data:{message: msg.invalidToken}})
        else response({status: false, data:{message: msg.error}})
    })
}

function setPermission(req,response){
    auth.verify(req.headers['jwt'], data => {
        if(data){
            if(data.roles_id.includes(1) || data.roles_id.includes(2))
            {
                mod.setPermissions(data,req,result=>{
                    if(result) response(getRes(true,null,msg.updated))
                    else response(getRes(false,null,msg.error))
                })
            }else response(getRes(false,null,msg.unauthorized))
        }else response(getRes(false,null,msg.invalidToken))
    })
}


function changePassword(req,response){
    auth.verify(req.headers['jwt'], data => {
        if(data){
            var user_id= req.body.user_id
            var new_password = req.body.new_password
            var old_password = req.body.old_password
            try{
               var confirm_password=req.body.confirm_password
            }catch(err){
                confirm_password=''
            }
            
            mod.checkUsernameOrIdExisting(null,user_id, existed=>{
                if(existed)
                    if(data.roles_id.includes(2)){
                        mod.updateUserPassword(data,user_id,new_password,result=>{
                            if(result) response({status: true, data:{message: msg.passwordUpdated}})
                            else response({status: false, data:{message: msg.error}})
                        })
                    }
                    else if(data.user_id == user_id){
                        mod.checkOldPassword(user_id,old_password, result=>{
                            if(result){
                                mod.updateUserPassword(user_id,new_password,_result=>{
                                    if(_result) response({status: true, data: {message:msg.passwordUpdated}})
                                    else response({status: false, data: {message: msg.error}})
                                })
                            }
                            else response({status: false, data:{message: msg.invalidPassword}})
                        })      
                    }else response({status: false, data:{message: msg.unauthorized}})
                else response({status: false, data:{message: msg.userNotFound}})
            })
        }else response(getRes(false,null,msg.invalidToken))
    })
}
function setExpoPushToken(req,response){
    auth.verify(req.headers['jwt'], data => {
        var created_at = getDateTime(null, "Y-m-d H:M:S");
    var updated_at = getDateTime(null, "Y-m-d H:M:S");
    // //console.log('dataList==============>',req.body)
        try{
          var token=req.body.token
        }catch(err){
            token=null;
            //console.log(err.message)
        }
        try{
            var is_other=req.body.is_other
          }catch(err){
            is_other=0;
            //console.log(err.message)
        }
        try{
            var is_logout=req.body.is_logout
          }catch(err){
            is_logout=0;
            //console.log(err.message)
        }

        if(data){
            mod.setExpoPushToken({
                user_id:data.user_id,
                token:token,
                is_logout:is_logout,
                is_other:is_other,
                updated_at,
                created_at
            },result=>{
                if(result) response(getRes(true,null,msg.inserted))
                else response(getRes(false,null,msg.error))
            })
        }else response(getRes(false,null,msg.invalidToken))
    })
}

function copyPermissionsForAnotherUsers(req,response){
    auth.verify(req.headers['jwt'], data => {
        if(data){
            if(data.roles_id.includes(1) || data.roles_id.includes(2))
            {
                try {
                    var from_user_id = req&&req.body&&req.body.from_user_id?req.body.from_user_id:0;
                  } catch (err) {
                    var from_user_id = 0;
                }
                try {
                    var to_user_ids = req&&req.body&&req.body.to_user_ids?req.body.to_user_ids:[];
                  } catch (err) {
                    var to_user_ids = [];
                }
                try {
                    var copy_as_group_base = req&&req.body&&req.body.copy_as_group_base?req.body.copy_as_group_base:0;
                  } catch (err) {
                    var copy_as_group_base = 0;
                }
                let messageError=null;
                if(!from_user_id){
                    messageError="You must Select From User";
                }
                if(!to_user_ids){
                    if(messageError)
                    messageError+=', and To users'
                    else
                    messageError='You must select To users'
                }
                if(messageError)
                  response(getRes(false,null,messageError))
                if(copy_as_group_base==0){
                    mod.copyPermissionsForAnotherUsers({
                        ...data,
                        from_user_id:from_user_id,
                        to_user_ids:to_user_ids,
                        copy_as_group_base
                    },result=>{
                        if(result&&result!='no roles'&&result!='not all permissions')return response(getRes(true,null,msg.updated))
                        else if(result=='no roles'){
                        return response(getRes(false,null,msg.noRolesForSelectedUser))
                        }else if(result=='not all permissions'){
                            return response(getRes(false,null,msg.notAllActivityInsert))
                        }
                        else return response(getRes(false,null,msg.error))
                    })
                }else{
                    mod.copyPermissionsForAnotherUsersByGroup({
                        ...data,
                        from_user_id:from_user_id,
                        to_user_ids:to_user_ids,
                        copy_as_group_base
                    },result=>{
                        if(result&&result!='no groups or user not base on groups'&&result!='not all permissions')return response(getRes(true,null,msg.updated))
                        else if(result=='no groups or user not base on groups'){
                        return response(getRes(false,null,result))
                        }else if(result=='not all permissions'){
                            return response(getRes(false,null,msg.notAllActivityInsert))
                        }
                        else return response(getRes(false,null,msg.error))
                    })
                }
            }else response(getRes(false,null,msg.unauthorized))
        }else response(getRes(false,null,msg.invalidToken))
    })
}

function handleAllowSendEmail(req,response){
    auth.verify(req.headers['jwt'], data => {
        if(data){
            if( data.roles_id.includes(2) 
            || (!data.roles_id.includes(2) && req?.params?.user_id == data?.user_id))
            {
                try {
                    var allow_send_email = req&&req.body&&req.body.allow_send_email?req.body.allow_send_email:0;
                  } catch (err) {
                    var allow_send_email = 0;
                }
            
               

                mod.handleAllowSendEmail({
                    ...data,
                    allow_send_email:allow_send_email,
                    req_user_id:req?.params?.user_id
                },result=>{
                    return response(result)
                })
            }else response(getRes(false,null,msg.unauthorized))
        }else response(getRes(false,null,msg.invalidToken))
    })
}

module.exports = {createUsers,updateUser,getUsers,getUsersList,changePassword,setPermission,enableUser,setExpoPushToken,getUsersReport,downloadUsers,copyPermissionsForAnotherUsers,handleAllowSendEmail}
