var log4js = require('log4js'),
path = require("path")

var logDir = path.join(__dirname, '../..', 'logs/');
var _appenders={};


var _appenders = {
    errorLogs: { type: 'file', filename: logDir+'errors.log' },
    debugLogs: {type: 'file', filename: logDir+'debugs.log' },
    console: { type: 'console' }
  }

  var _categories = {
    errors: { appenders: ['errorLogs','console'], level: 'error' },
    debugs: { appenders: ['debugLogs'], level: 'debug' },
    default: { appenders: ['console'], level: 'debug' }
  }

log4js.configure({
    appenders: _appenders,
    categories: _categories
  });


module.exports = log4js
