var mod = require('./depModels')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
var getRes = require('../../helper/common').getResponse

function createDepartment(req,response){
    auth.verify(req.headers['jwt'],data =>{
        if(data){
            if(data.roles_id.includes(3)){
                mod.insertDepartment(data,req, result=>{
                    if(result) response(getRes(true,{message: msg.inserted,dep_id:result.insertId}))
                    else response(getRes(false,msg.error))
                })
            }else response(getRes(false,msg.failedCreateDep))
        }else response(getRes(false,msg.invalidToken))
    })
}

function deleteDepartment(req,response){
    auth.verify(req.headers['jwt'],data =>{
        if(data){
            if(data.roles_id.includes(4)){
                mod.deleteDepartment(data,req, result=>{
                    if(result) response(getRes(true,{message: msg.deleted}))
                    else response(getRes(false,msg.error))
                })
            }else response(getRes(false,msg.failedDeleteDep))
        }else response(getRes(false,msg.invalidToken))
    })
}

function updateDepartment(req,response){
    auth.verify(req.headers['jwt'],data =>{
        if(data){
            if(data.roles_id.includes(4)){
                mod.updateDepartment(data,req, result=>{
                    if(result.msg) response(getRes(result.status,result.msg))
                    else if(result) response(getRes(true,{message: msg.updated}))
                })
            }else response(getRes(false,msg.failedUpdateDep))
        }else response(getRes(false,msg.invalidToken))
    })
}

function getDepartments(all,req,response){
    auth.verify(req.headers['jwt'],data =>{
        if(data){
            var dep_id = !all ?  req.params.dep_id : null
            mod.getDepartments(dep_id, result=>{
                if(result) response(getRes(true,result))
                else response(getRes(false,msg.invalidToken))
            })
        }else response(getRes(false,msg.invalidToken))
    })
}


module.exports = {getDepartments,createDepartment,deleteDepartment,updateDepartment}
