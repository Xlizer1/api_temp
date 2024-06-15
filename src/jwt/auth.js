const jwt = require('jsonwebtoken');
const key = "IS_wenkGPS";
const expiresIn = '12h';
var executeQuery = require('../helper/common').executeQuery
exports.verify = (token, callback) => {
    try {
        var data=jwt.verify(token, key).data
        if(data)
            checkDataTokenValidation(data,result=>{
                if(result) callback(data)
                else callback(null)
            })
        else callback(data);
    } catch {
        callback(null);
    }
};

exports.generate = (data,NoExpire) => {
    let expiryValue = {
        expiresIn: expiresIn
    }
    if(NoExpire)
    {
        expiryValue = {}
    }
    // console.log("expiryValue",expiryValue);
    return jwt.sign({
        data: data
    },
     key, 
     expiryValue
     );
};

function checkDataTokenValidation(data,callback){
    var sql=`select enabled from users where user_id=${data.user_id} and deleted_at is null`
    executeQuery(sql,'checkDataTokenValidation',result=>{
        if(result && result.length>0 && result[0].enabled) callback(true)
        else callback(false)
    })
}
