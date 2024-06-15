var executeQuery = require('./common').executeQuery
// var log4js = require('../config/logger')

// var errorLogs = log4js.getLogger('errors'),
// debugLogs = log4js.getLogger('debugs')
var logs,roles,suppliers

function getLogType(callback){
    var sql = `select log_type_id as id,type from log_type where deleted_at is null`
    if(logs) callback(logs)
    else  
        executeQuery(sql,'getLogType',result=>{
            var i=0
            logs={}
            for(const logType of result){
                var key = logType.type;
                logs[key] = logType.id;
                i++
                if(i>=result.length) callback(logs)
            }
        })
 }

 function getRoles(callback){
    var sql = `select * from roles`
    if(roles) callback(roles)
    else  
        executeQuery(sql,'getLogType',result=>{
            var i=0
            roles={}
            for(const role of result){
                var key = role.role_id;
                roles[key] = role.name;
                i++
                if(i>=result.length) callback(roles)
            }
        })
 }

 function getSuppliers(callback) {
   var sql = `
        SELECT 
            customers.erp_customer_supplier,
            customers.erp_customer_supplier_id,
            count(customer_id) as total_count
        FROM customers 
        WHERE 
            erp_customer_supplier IS NOT NULL 
        GROUP BY 
            customers.erp_customer_supplier;`;
   if (suppliers) callback(suppliers);
   else
     executeQuery(sql, "getLogType", (result) => {
       var i = 0;
       suppliers = {};
       for (const supplier of result) {
         var key = supplier.erp_customer_supplier_id;
         suppliers[key] = supplier.erp_customer_supplier;
         i++;
         if (i >= result.length) callback(suppliers);
       }
     });
 }


module.exports = {getLogType,getRoles,getSuppliers}