
var executeQuery = require('../../helper/common').executeQuery
var getDateTime = require('../../helper/common').getDateTime

function getRoles(req,callback){
   // var roles = req.body.role_id    //should be an array
    // var condition =""
    
    // if(roles.length > 0) {
    //     condition = 'where role_id in ('+roles.toString()+') '
    // }
    var sql = `select a.role_id,
    if(task_type_id is null,a.name,(concat("VIEW: ",(select b.name from task_type b where b.task_type_id=a.task_type_id))))  as name,
    if(task_type_id is null,null,(select b.name from task_type b where b.task_type_id=a.task_type_id))  as task_type_name
    from roles a`
    executeQuery(sql,'getRoles',result=>{
        callback(result)
    })
}

module.exports={getRoles}