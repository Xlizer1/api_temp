var mod = require('./rolesModels')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
var getRes = require('../../helper/common').getResponse

function getRoles(req,response){
    auth.verify(req.headers['jwt'],data =>{
        if(data){
            mod.getRoles(req,result=>{
                if(result) response(getRes(true,result))
                else response(getRes(false,null,msg.error))
            })
        }
        else response(getRes(false,null,msg.invalidToken))
    })
}

function setRoles(req,response){
    var roleName = req.body.role_name
    db.query(`insert into roles set name = '${roleName}' `,
    (error, result) => {

        if (!error)  response({status: true, data: {"role_id":result.insertId, "name":roleName}})
        else {
            errorLogs.error(error)
            response({status: false, data: null})
        }
    });
}

module.exports = {getRoles,setRoles}
