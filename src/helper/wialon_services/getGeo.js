var getSid = require('./main_service').getSid
var makeRequest = require('./main_service').makeRequest
var executeQuery = require('../../helper/common').executeQuery
var geofences = [
  // {name:"الموقع غير حقيقي",x:50.866962,y:1.722266}
];

var users_response = {};
var flag = 4096 //+ 1048576 + 1; // 4096 for geofences, 1048576 for geo groups, 1 for basic details

function search(sid, callback) {
  var itemType = "avl_resource", propName = "pois", flags = flag
  let spec = {
    "itemsType": itemType,
    "propName": propName,
    "propValueMask": "*",
    "sortType": propName,
    "propType": "property"
  };

  var params = JSON.stringify(
    {
      "spec": spec,
      "force": 0,
      "flags": flags,
      "from": 0,
      "to": 0
    }
  );
  var svc = "svc=core/search_items";
  var url = "https://hst-api.wialon.com/wialon/ajax.html?" + svc + "&params=" + params + "&sid=" + sid
  // console.log(url)
  makeRequest(url, 'search', res => {
    if (res.status) {
      //do something to handle response
      callback(res.data)
    }
    else callback(false)
  })

}

function validSid(sid,host, callback) {
  
  var url = host + "/avl_evts?sid=" + sid
  // if(url.includes("https://local.wenkgps.com"))
  // {
  //   url = url.replace("https://local.wenkgps.com","http://local.wenkgps.com")
  // }
  // console.log(url)
  makeRequest(url, 'search', res => {
    if (res.status) {
      //do something to handle response
      // console.log("sid valid");
      callback(res.data)
    }
    else callback(res)
  })

}

function getGeofences(force, callback) {
  if (!force && geofences.length > 0) callback({ length: geofences.length, data: geofences })
  else {
    getSid(sid => {
      if (sid)
      {
        search(sid, res => {
          if (res) {
            var sql = `SET AUTOCOMMIT=0;    
            START TRANSACTION;
            delete from geofences;`
            
           // var sql = `BEGIN;`

            var myObject = res.items[0].zl
            // console.log(myObject)
            Object.keys(myObject).map(function (key, index) {
              // console.log(myObject)
              // if(myObject[key].t==3) 
              geofences.push({
                name: myObject[key].n,
                x: myObject[key].b.cen_x,
                y: myObject[key].b.cen_y
              })
              sql = sql + `INSERT into geofences (name,x,y) values ("${myObject[key].n}",${myObject[key].b.cen_x},${myObject[key].b.cen_y});`
            });
            sql = sql + `COMMIT;`
            executeQuery(sql, 'getGeofences->addGeoToTable', result => {

            })
            callback({ length: geofences.length, data: geofences })
          }
          else callback(false)
        })
      }
      else{
        callback(false)
      }
        
    })
  }
}

module.exports = { getGeofences,validSid }