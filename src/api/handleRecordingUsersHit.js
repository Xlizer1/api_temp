var db = require("../config/db");
var log4js = require("../config/logger");
var datetime = require("node-datetime");
var auth = require("../jwt/auth");
const { getDateTime, executeQuery } = require("../helper/common");

const handleRecordingUsersHit = (req, res, next) => {
  try {
    
    let createdOrUpdate = getDateTime(null, "Y-m-d H:M:S"),
      url = req?.url ? req?.url : "",
      method = req?.method ? req?.method : "";

    if (!url || url == "/") {
      return next();
    } else if (url?.includes("?")) {
      url = url.split("?");
      if (url.length > 1) {
        let urlSplited= url[0]
        let stringOfurl=url[0]
        if( urlSplited?.includes('/')){
          urlSplited=urlSplited?.split('/');
          // console.log('SPLITED-----DATA------->',urlSplited)
          if(urlSplited?.length>0){
            if(!isNaN(urlSplited[urlSplited?.length-1])){
              stringOfurl=''
               urlSplited?.map((itm,index)=>{
                if(urlSplited?.length!=(index+1))
                stringOfurl+=itm+'/';
               })
               url=urlSplited;
            }
          }
        }
        url = stringOfurl;
      }
    }else{
      let urlSplited= url
      let stringOfurl=url
      if( urlSplited?.includes('/')){
        urlSplited=urlSplited?.split('/');
        // console.log('SPLITED-----DATA------->',urlSplited)
        if(urlSplited?.length>0){
          if(!isNaN(urlSplited[urlSplited?.length-1])){
            stringOfurl=''
             urlSplited?.map((itm,index)=>{
              if(urlSplited?.length!=(index+1))
              stringOfurl+=itm+'/';
             })
             url=urlSplited;
          }
        }
      }
      url = stringOfurl;
    }
    auth.verify(req?.headers["jwt"], (data) => {
      if (data) {
        let user_id = data?.user_id;
        
        let sql = `insert into  url_hit_logs (user_id,url,count,method,created_at) values(${user_id},'${url}',1,'${method}','${createdOrUpdate}')`;
        let checkSql = `select * from url_hit_logs where user_id=${user_id} and url='${url}' and method='${method}' `;
        executeQuery(checkSql, "handleCheckRecordExists", (result) => {
          if (result && result?.length) {
            let count = 0,
              createdAt = "";
            let data = result[0];
            let counts = data?.count ? data?.count + 1 : 1;
            SelecID = data?.id;
            let arrayForDeleteIds = [];
            if (result?.length > 1) {
              result?.map((itm, index) => {
                if (index + 1 < result?.length) {
                  arrayForDeleteIds.push(itm.id);
                }else{
                    SelecID = itm?.id; 
                }
                count += itm?.count;
                if (!createdAt) {
                  if (createdAt > new Date(itm?.created_at)) {
                    createdAt = new Date(itm?.created_at);
                  }
                } else {
                  createdAt = new Date(itm?.created_at);
                }
              });
              counts = count;
            } else {
              createdAt = data?.created_at;
            }
            if (arrayForDeleteIds && arrayForDeleteIds?.length > 0) {
              let deleteQuery = `delete  from url_hit_logs where id in (${arrayForDeleteIds})`;
              executeQuery(deleteQuery, "handleDeleteRecord", (result) => {
                if(result){
                  // console.log('delete successfully')
                }else{
                    // console.log('delete failed')
                }       
              });
            }

            let updateSql = `update url_hit_logs set  count=${counts},created_at='${getDateTime(createdAt,"Y-m-d H:M:S")}',updated_at='${createdOrUpdate}' where id=${result[0]?.id}`;
            executeQuery(updateSql, "handleUpdateRecord", (result) => {
              if (result && result?.affectedRows > 0) {
                // console.log("updated success===>", result);
                return next();
              } else {
                // console.log("updated failed===>", result);
                return next();
              }
            });
          } else {
            executeQuery(sql, "handleRecordingUsersHit", (result) => {
              if (result && result?.insertId > 0) {
                // console.log("updated success===>", result);
                return next();
              } else {
                // console.log("updated failed===>", result);
                return next();
              }
            });
          }
        });
      } else {
        
        return next();
      }
    });
  } catch (err) {
    
    return next();
  }
};
module.exports = handleRecordingUsersHit;
