var activity = require('../../helper/activitiesMsg')
var executeQuery = require('../../helper/common').executeQuery
var getDateTime = require('../../helper/common').getDateTime
// var pushN = require('./pushNotification').pushNotification

function getNotifications(searchFields, callback) {
    let checkShow=searchFields.roles_id.includes(37)
    // pushN();
    let select = `
    SELECT 
    a.task_id,
    a.mission_id,
    a.submission_id,
    a.log_type_id,
    a.note,
    a.name,
    a.created_at,
    a.activity_id,
    users.name as  user,
    a.user_id,
    notifications.viewed_at

    `
    let selectTotal = `
    SELECT 
    count(*) as total_rows
`
    let sql = `

    FROM activities a
    left join tasks c on c.task_id=a.task_id
    left join users on users.user_id = a.user_id
    left join leave_requests on leave_requests.id=a.leave_request_id
    left join user_overtimes on user_overtimes.id=a.user_overtime_id
    left join notifications on notifications.activity_id = a.activity_id and notifications.user_id = ${searchFields.user_id}

    where (
        ( 
          ( a.log_type_id IN (30,31,32,33) and (${checkShow}) and a.mission_id in (SELECT mission_id from sub_missions where sub_missions.eng_id = ${searchFields.user_id}) ) or ${searchFields.roles_id.includes(83)}
        )
        or 
        ( 
          ( 
            a.log_type_id IN (35,36,37)  and (
                a.leave_request_id is not null and 
                (
                  ( 
                    (
                      a.log_type_id=35 and
                      a.user_id != ${searchFields.user_id} and
                      users.department_id  in (${searchFields.departments})
                    ) 
                    or 
                    (
                      leave_requests.leave_request_status_id is  null and
                      leave_requests.user_id=${searchFields.user_id} and
                      users.department_id  in (${searchFields.departments})
                    )
                  )
                  or 
                  ( 
                    (
                      leave_requests.leave_request_status_id is not null and
                      a.user_id != ${searchFields.user_id} and
                      leave_requests.user_id=${searchFields.user_id}
                    )
                    or
                    (
                      leave_requests.leave_request_status_id is not null and
                      leave_requests.user_id=${searchFields.user_id} and
                      users.department_id  in (${searchFields.departments})
                    )
                  )
                ) 
              ) 
          ) or ${searchFields.roles_id.includes(83)}  
        )
        or 
        ( 
          (
            a.log_type_id IN (38,39,40)  and (
              a.user_overtime_id is not null and
               (
                ( 
                  (
                    a.log_type_id=38 and
                    a.user_id != ${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  )
                  or
                  (
                    user_overtimes.user_overtime_status_id = 1 and
                    user_overtimes.user_id=${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  )
                )
                or 
                ( 
                  (
                    user_overtimes.user_overtime_status_id > 1 and
                    a.user_id != ${searchFields.user_id} and
                    user_overtimes.user_id=${searchFields.user_id}
                  )
                  or
                  (
                    user_overtimes.user_overtime_status_id > 1 and
                    user_overtimes.user_id=${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  )
                )
               ) 
            ) 
          ) or ${searchFields.roles_id.includes(83)}  
        )
        or 
        ( 
          ( a.log_type_id IN (6) and ${searchFields.roles_id.includes(91)})
        )
       )
    `
    if (searchFields.startDate) {
        sql += " AND `a`.`created_at` >= '" + searchFields.startDate + "'";
    }
    if (searchFields.endDate) {
        sql += " AND `a`.`created_at` <= '" + searchFields.endDate + "'";
    }
    if (searchFields.usersCreatedbySelected.length > 0) {
        sql += " AND `a`.`user_id` in (" + searchFields.usersCreatedbySelected + ")";
    }
    if(searchFields&&searchFields.task_id){
        sql += ` AND a.task_id = ${searchFields.task_id} `;
    }
    if(searchFields&&searchFields.mission_id){
        sql += ` AND a.mission_id = ${searchFields.mission_id} `;
    }
    if(searchFields&&searchFields.note){
        sql += ` AND a.name LIKE '%${searchFields.note}%' `;
    }
    if(searchFields&&searchFields.activity_id){
        sql += ` AND a.activity_id =  ${searchFields.activity_id} `;
    }
    if(searchFields&&searchFields.updated_user_id){
        sql += ` AND a.user_id = ${searchFields.updated_user_id} `;
    }

    // console.log('handledQuery',selectTotal+ sql);
    executeQuery(selectTotal+ sql, 'getNotifications', resultTotal => {
        totalRows =-1
        if (resultTotal && resultTotal.length) {
            totalRows=resultTotal[0].total_rows;
        }
        sql+=` order by created_at desc LIMIT ${searchFields.offset* searchFields.itemsPerPage},${searchFields.itemsPerPage}`
        executeQuery(select+ sql, 'getNotifications', result => {
            if (result) {
                var _data = [], i = 0
                if (result.length == 0) {
                    let response={
                        "total":totalRows,
                        "data":result,
                        "page":searchFields.offset
                    }
                    callback(response)
                    return
                }
                for (const notification of result) {

                    _data.push({
                        type: notification?.name?notification?.name:'mission_updated',
                        activity_id: notification.activity_id,
                        task_id: notification.task_id,
                        mission_id: notification.mission_id,
                        task_title: notification.task_title,
                        note: notification.note,
                        user_updater: notification.user,
                        date_time: notification.created_at
                    })

                }
                let response={
                    "total":totalRows,
                    "data":_data,
                    "page":searchFields.offset
                }
                callback(response)
                return
            }
            else {
                callback(false)
                return
            }
       })
    })
}

function setNotificationViewed(activity_id, user_id, callback) {
    sql = `insert into notifications set activity_id=${activity_id} , user_id=${user_id}, viewed_at='${getDateTime()}'`
    executeQuery(sql, 'setNotificationViewed', result => {
        callback(result)
    })
}

function clearNotifications(user_id, callback) {
    getNotifications(user_id, result => {
        var sql = ''
        result.forEach(element => {
            sql += `insert into notifications set activity_id=${element.activity_id} , user_id=${user_id}, viewed_at='${getDateTime()}';`
        });
        if (sql == '') callback(true)
        else
            executeQuery(sql, 'clearNotifications', _result => {
                callback(_result)
            })
    })
}

function getTopFiveUnReadNotification(searchFields, callback) {
    let checkShow=searchFields.roles_id.includes(37)

    let sql = `
    SELECT 
    a.task_id,
    a.mission_id,
    a.submission_id,
    a.log_type_id,
    a.note,
    a.name,
    a.created_at,
    a.activity_id,
    users.name as  user,
    a.user_id,
    notifications.viewed_at

    FROM activities a
    left join tasks c on c.task_id=a.task_id
    left join users on users.user_id = a.user_id
    left join leave_requests on leave_requests.id=a.leave_request_id
    left join user_overtimes on user_overtimes.id=a.user_overtime_id
    left join notifications on notifications.activity_id = a.activity_id and notifications.user_id = ${searchFields.user_id}

    where (
      ( 
        ( a.log_type_id IN (30,31,32,33) and (${checkShow}) and a.mission_id in (SELECT mission_id from sub_missions where sub_missions.eng_id = ${searchFields.user_id}) ) or ${searchFields.roles_id.includes(83)}
      )
      or 
      ( 
        ( 
          a.log_type_id IN (35,36,37)  and (
              a.leave_request_id is not null and 
              (
                ( 
                  (
                    a.log_type_id=35 and
                    a.user_id != ${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  ) 
                  or 
                  (
                    leave_requests.leave_request_status_id is  null and
                    leave_requests.user_id=${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  )
                )
                or 
                ( 
                  (
                    leave_requests.leave_request_status_id is not null and
                    a.user_id != ${searchFields.user_id} and
                    leave_requests.user_id=${searchFields.user_id}
                  )
                  or
                  (
                    leave_requests.leave_request_status_id is not null and
                    leave_requests.user_id=${searchFields.user_id} and
                    users.department_id  in (${searchFields.departments})
                  )
                )
              ) 
            ) 
        ) or ${searchFields.roles_id.includes(83)}  
      )
      or 
      ( 
        (
          a.log_type_id IN (38,39,40)  and (
            a.user_overtime_id is not null and
             (
              ( 
                (
                  a.log_type_id=38 and
                  a.user_id != ${searchFields.user_id} and
                  users.department_id  in (${searchFields.departments})
                )
                or
                (
                  user_overtimes.user_overtime_status_id = 1 and
                  user_overtimes.user_id=${searchFields.user_id} and
                  users.department_id  in (${searchFields.departments})
                )
              )
              or 
              ( 
                (
                  user_overtimes.user_overtime_status_id > 1 and
                  a.user_id != ${searchFields.user_id} and
                  user_overtimes.user_id=${searchFields.user_id}
                )
                or
                (
                  user_overtimes.user_overtime_status_id > 1 and
                  user_overtimes.user_id=${searchFields.user_id} and
                  users.department_id  in (${searchFields.departments})
                )
              )
             ) 
          ) 
        ) or ${searchFields.roles_id.includes(83)}  
      )
      or 
      ( 
        ( a.log_type_id IN (6) and ${searchFields.roles_id.includes(91)})
      )
     )
      
     order by created_at desc
    LIMIT 5;
    `
    if (searchFields.usersCreatedbySelected.length > 0) {
        sql += " AND a.user_id in (" + searchFields.usersCreatedbySelected + ")";
    }
    // console.log(sql);
    executeQuery(sql, 'getNotifications', result => {
        if (result) {
            var _data = [], i = 0
            if (result.length == 0) {
                callback(result)
                return
            }
            for (const notification of result) {

                _data.push({
                    type: notification?.name?notification?.name:'mission_updated',
                    activity_id: notification.activity_id,
                    task_id: notification.task_id,
                    mission_id: notification.mission_id,
                    task_title: notification.task_title,
                    note: notification.note,
                    user_updater: notification.user,
                    date_time: notification.created_at
                })

            }
            callback(_data)
            return
        }
        else {
            callback(false)
            return
        }
    })
}

module.exports = { 
    getNotifications, 
    setNotificationViewed, 
    clearNotifications,
    getTopFiveUnReadNotification
}