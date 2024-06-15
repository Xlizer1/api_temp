var executeQuery = require('../../helper/common').executeQuery
var getDateTime = require('../../helper/common').getDateTime


function checkDepartmentId(dep_id, existed){
    var sql = `select department_id from departments where deleted_at is NULL and department_id = "${dep_id}" `
    executeQuery(sql,'checkDepartmentId',result=>{
        if(result.length > 0) existed(true);
        else existed(false)
    })
}

function insertDepartment(data,req,callback){
    var dep_name = req.body.dep_name,
    sql = `Begin;
    insert into departments set name = "${dep_name}" , created_at = now();
    insert into activities(log_type_id,user_id,dep_id,note,created_at) values
            (11,${data.user_id},LAST_INSERT_ID(),'name:${dep_name}',now());
    Commit;`
    executeQuery(sql,'insertDepartment',result=>{
        callback(result[1])
    })
}

function deleteDepartment(data,req,callback){
    var dep_id = req.params.dep_id
    checkDepartmentId(dep_id, existed=>{
        if(existed){
            var sql= `Begin;
            update departments set deleted_at = "${getDateTime()}" where department_id= ${dep_id};
                insert into activities(log_type_id,user_id,dep_id,note,created_at) values
                (12,${data.user_id},${dep_id},'department deleted',now());
                Commit;`
            executeQuery(sql,'deleteDepartment',result=>{
                callback(result[1])
            })
        }else callback('dep_id not existed')
    })
}

function updateDepartment(data,req,callback){
    var dep_id = req.params.dep_id,
    dep_name = req.body.dep_name
    checkDepartmentId(dep_id, existed=>{
        if(existed){
            var sql=`Begin;
                update departments set name = "${dep_name}" where department_id= ${dep_id};
                insert into activities(log_type_id,user_id,dep_id,note,created_at) values
                (12,${data.user_id},${dep_id},'department updated, name:${dep_name}',now());
                Commit;`
            
            executeQuery(sql,'updateDepartment',result=>{callback(result)})
        }else callback({status:false, msg: 'dep_id not existed'})
    })
}

function getDepartments(dep_id,callback){   
    var sql = `select department_id as dep_id,name from departments where deleted_at is null`
    if(dep_id) sql = sql + ' and department_id= '+dep_id
    executeQuery(sql,'getDepartments',result=>{callback(result)})
}


module.exports={getDateTime, insertDepartment,deleteDepartment,getDepartments,updateDepartment}