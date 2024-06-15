const axios = require('axios')
var log4js = require('../../config/logger')
var errorLogs = log4js.getLogger('errors')
const https = require('https');
const fs = require('fs')
const path = require('path')
let caCrt = '';
// var token= "d72cdaeef89361f10f3548fcdd293d4f010890BF6B8E547B0DDB620664793847B4E2D553"
var token = "6a3a6b0e039d06131c02d613f778467c456F88DDCA314D97279860A768BD8F3915175F98"
// var sidRequestTime = 1000 * 20 * 1 //1 min
try {
  let caCrtFilePath = path.join(__dirname, "./ca3.ca-bundle");
  caCrt = fs.readFileSync(caCrtFilePath)
}
catch (err) {
  console.log('Make sure that the CA cert file is named ca.ca-bundle', err);
}
function makeRequest(url, logName, callback) {
  const httpsAgent = new https.Agent({ ca: caCrt, keepAlive: false })
  // console.log("inside make request")
  var path = "out"
  axios.get(url, 
    {
    // httpsAgent: httpsAgent//TODO add httpsAgent for manual settup a crt
  }
  )
    .then(function (response) {
      path += " then"
      // console.log("then")
      if (response.data.hasOwnProperty('error')) {

        errorLogs.error(logName, ":", response.data)
        callback({ status: false, data: response.data })
      }
      else callback({ status: true, data: response.data })
    })
    .catch(function (error) {
      path += " catch"
      console.log("error catche")
      callback(error);
      errorLogs.error(logName, ":", error)
    })
    .finally(function () {
      path += " finally"
      // console.log(path)
      // callback(error); 
    });
}

var getSid = (callback) => {
  var params = JSON.stringify({ token: token });
  var svc = "svc=token/login"
  var url = "https://hst-api.wialon.com/wialon/ajax.html?" + svc + "&params=" + params
  // console.log(url)
  makeRequest(url, 'sid', res => {
    if (res.status) callback(res.data.eid)
    else console.log('sid not valis should sent an email')
  })
}

module.exports = {
  getSid, makeRequest
}