var mod = require('./notificationModels')

var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
const { addHoursToDateString, getDayOfWeekFromDate, getDateTime, addDaysToDateString } = require('../../helper/common')
var getRes = require('../../helper/common').getResponse


function getNotifications(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            
            try {
                var searchFields = JSON.parse(req.query.params).searchFields
            } catch (error) {
                var searchFields = {}
            }
            
            
            try {
                var startDate = searchFields.startDate ? searchFields.startDate : null
            } catch (e) {
                //console.log("Error in here: " + e)
                var startDate = null
            }
            try {
                var endDate = searchFields.endDate ?searchFields.endDate :null
            } catch (e) {
                //console.log("Error in here: " + e)
                var endDate = null
            }

            try {
                var searchText = searchFields.searchText ? searchFields.searchText : ""
            } catch (e) {
                //console.log("Error in here: " + e)
                var searchText = ""
            }
            
            try {
                var task_id = searchFields.task_id
            } catch (error) {
                var task_id = 0
            }
            try {
                var mission_id = searchFields.mission_id
            } catch (error) {
                var mission_id = 0
            }
            try {
                var activity_id = searchFields.activity_id
            } catch (error) {
                var activity_id = 0
            }
            try {
                var note = searchFields.note
            } catch (error) {
                var note = 0
            }
            try {
                var user_id = searchFields.user_id
            } catch (error) {
                var user_id = 0
            }


            try {
                var offset = JSON.parse(req.query.params).offset
            } catch (error) {
                var offset = 0
            }
            try {
                var itemsPerPage = JSON.parse(req.query.params).itemsPerPage
            } catch (error) {
                var itemsPerPage = 10
            }

            var departments = [];
            try {
              // departments.push(data.user_department_id);
              if (data.roles_id.includes(38)) {
                departments.push(1);
              }
              if (data.roles_id.includes(39)) {
                departments.push(2);
              }
              if (data.roles_id.includes(40)) {
                departments.push(3);
              }
              if (data.roles_id.includes(41)) {
                departments.push(4);
              }
              if (data.roles_id.includes(42)) {
                departments.push(5);
              }
              if (data.roles_id.includes(43)) {
                departments.push(6);
              }
              if (data.roles_id.includes(44)) {
                departments.push(7);
              }
              if (data.roles_id.includes(45)) {
                departments.push(8);
              }
              if (data.roles_id.includes(46)) {
                departments.push(9);
              }
              if (data.roles_id.includes(47)) {
                departments.push(10);
              }
              if (data.roles_id.includes(48)) {
                departments.push(11);
              }
              if (data.roles_id.includes(49)) {
                departments.push(12);
              }
              if (departments.length == 0) departments.push(0);
      
              // console.log('departments',departments)
            } catch (err) {
              if (departments.length == 0) departments.push(0);
            }
            
         

            var usersCreatedbySelected = searchFields.usersCreatedbySelected ? searchFields.usersCreatedbySelected.map((element) => (element.user_id)) : []
            mod.getNotifications(
                {
                    user_id:data.user_id, 
                    roles_id:data.roles_id,
                    offset,
                    itemsPerPage,
                    searchText,
                    startDate,
                    endDate,
                    usersCreatedbySelected,
                    task_id,
                    mission_id,
                    updated_user_id:user_id,
                    activity_id,
                    note,
                    departments

                },
                result => {
                    if (result) response(getRes(true, result))
                    else response(getRes(false, null, msg.error))
                })
        } else response(getRes(false, null, msg.invalidToken))
    })
}

function setNotificationViewed(req, response) {
    auth.verify(req.headers['jwt'], data => {
        var activity_id = req.params.activity_id
        if (data) {
            mod.setNotificationViewed(activity_id, data.user_id, result => {
                if (result) response(getRes(true, null, msg.notificationRead))
                else response(getRes(false, null, msg.error))
            })
        } else response(getRes(false, null, msg.invalidToken))
    })
}

function clearNotifications(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            mod.clearNotifications(data.user_id, result => {
                if (result) response(getRes(true, null, msg.notificationCleared))
                else response(getRes(false, null, msg.error))
            })
        } else response(getRes(false, null, msg.invalidToken))
    })
}

function getTopFiveUnReadNotification(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            try {
                var searchFields = JSON.parse(req.query.params).searchFields
            } catch (error) {
                var searchFields = {}
            }

            try {
                var startDate = searchFields.startDate ? searchFields.startDate : null
            } catch (e) {
                //console.log("Error in here: " + e)
                var startDate = null
            }
            try {
                var endDate = searchFields.endDate ?searchFields.endDate :null
            } catch (e) {
                //console.log("Error in here: " + e)
                var endDate = null
            }
            var departments = [];
            try {
              // departments.push(data.user_department_id);
              if (data.roles_id.includes(38)) {
                departments.push(1);
              }
              if (data.roles_id.includes(39)) {
                departments.push(2);
              }
              if (data.roles_id.includes(40)) {
                departments.push(3);
              }
              if (data.roles_id.includes(41)) {
                departments.push(4);
              }
              if (data.roles_id.includes(42)) {
                departments.push(5);
              }
              if (data.roles_id.includes(43)) {
                departments.push(6);
              }
              if (data.roles_id.includes(44)) {
                departments.push(7);
              }
              if (data.roles_id.includes(45)) {
                departments.push(8);
              }
              if (data.roles_id.includes(46)) {
                departments.push(9);
              }
              if (data.roles_id.includes(47)) {
                departments.push(10);
              }
              if (data.roles_id.includes(48)) {
                departments.push(11);
              }
              if (data.roles_id.includes(49)) {
                departments.push(12);
              }
              if (departments.length == 0) departments.push(0);
      
              // console.log('departments',departments)
            } catch (err) {
              if (departments.length == 0) departments.push(0);
            }

            var usersCreatedbySelected = searchFields.usersCreatedbySelected ? searchFields.usersCreatedbySelected.map((element) => (element.user_id)) : []
            mod.getTopFiveUnReadNotification(
                {
                  user_id:data.user_id,
                  roles_id:data.roles_id,
                  usersCreatedbySelected,
                  startDate,
                  endDate,
                  departments
                },
                result => {
                    if (result) response(getRes(true, result))
                    else response(getRes(false, null, msg.error))
                })
        } else response(getRes(false, null, msg.invalidToken))
    })
}

module.exports = { 
    getNotifications, 
    setNotificationViewed, 
    clearNotifications, 
    getTopFiveUnReadNotification 
}
