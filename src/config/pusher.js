const Pusher = require("pusher");
var executeQuery = require('../helper/common').executeQuery

const pusher = new Pusher({
    appId: "1576333",
    key: "9c36a8d1d324842389dd",
    secret: "d9396fbf29e27c7282b4",
    cluster: "ap1",
    useTLS: true
});

const sendSubmissionUpdatedNotification = (notificationObject) => {
    pusher.trigger("submissions_notifications", "submission_updated", {
        // message: "hello world"
        ...notificationObject,
        channelBrodcast: 1,

    });
}
const sendApprovedOrRejectedRequestNotificationForSpecificUser = (notificationObject) => {
    console.log('notification-sending--------->notificationObject', notificationObject)

    // if(!notificationObject.user_id){
    //     return false;
    // }
    console.log('notification-sending--------->')
    const channelName = `leave_request_user_notification`;
    const eventName = 'leaveRequest_updated'
    pusher.trigger(channelName, eventName, {
        // message: "hello world"
        ...notificationObject,
        channelBrodcast: 2,
    });
    console.log('notification-sending--------->pusher', pusher)

}
const sendApprovedOrRejectedRequestNotificationForSpecificUserOverTime = (notificationObject) => {
    console.log('notification-sending--------->notificationObject', notificationObject)

    // if(!notificationObject.user_id){
    //     return false;
    // }
    console.log('notification-sending--------->')
    const channelName = `user_overtime_notification`;
    const eventName = 'userOverTime_updated'
    pusher.trigger(channelName, eventName, {
        // message: "hello world"
        ...notificationObject,
        channelBrodcast: 3,
    });
    console.log('notification-sending--------->pusher', pusher)

}
const externalTaskRequestNotification = (notificationObject) => {
    console.log('notification-sending--------->notificationObject', notificationObject)
    console.log('notification-sending--------->')
    const channelName = `external_task_request_notification`;
    const eventName = 'externalTaskRequest_create'
    pusher.trigger(channelName, eventName, {
        ...notificationObject,
        channelBrodcast: 4,
    });
    console.log('notification-sending--------->pusher', pusher)

}
const taskNotificationConfiguration = async (notificationObject) => {
    console.log('notification-sending--------->notificationObject', notificationObject)
    console.log('notification-sending--------->')
    let query = `select * from settings where field_name='TASK_NOTIFICATION_SYSTEMS' `
    let queryuser = `select * from users where user_id=${notificationObject?.user_id}`
    var taskData = null
    if (notificationObject && notificationObject?.task_id) {
        let taskQuery = `select task_type_id from tasks where task_id=${notificationObject?.task_id} `
        taskData = await new Promise(resolve => {
            executeQuery(taskQuery, 'getTaskData', result => {
                if (result && result?.length > 0)
                    resolve(result)
            })
        })
    } else if (notificationObject && notificationObject?.task_ids) {
        let taskQuery = `select task_type_id from tasks where task_id in (${notificationObject?.task_ids}) `
        taskData = await new Promise(resolve => {
            executeQuery(taskQuery, 'getTaskData', result => {
                if (result && result?.length > 0)
                    resolve(result)
            })
        })
    }
    if (notificationObject?.status_id > 0) {
        let queryuser = `select * from statuses where status_id=${notificationObject?.status_id}`
        var dataOfStatus = await new Promise(resolve => {
            executeQuery(queryuser, 'get status', result => {
                if (result && result?.length > 0)
                    resolve(result[0])
            })
        })
    }
    const dataOfQuery = await new Promise(resolve => {
        executeQuery(query, 'getTaskNotificationConfiguration', result => {
            if (result && result?.length > 0)
                resolve(result[0])
        })
    })
    const dataOfUser = await new Promise(resolve => {
        executeQuery(queryuser, 'getUser', result => {
            if (result && result?.length > 0)
                resolve(result[0])
        })
    })
    if (!dataOfQuery) {
        return console.log('there is error with query!', dataOfQuery)
    }
    try {
        var datalist = JSON.parse(dataOfQuery?.field_value)
        console.log('notification-sending--------->data', datalist)
        var user_ids = []
        if (taskData && taskData?.length > 0) {
            let taskTypeIds = taskData?.map(item => item?.task_type_id)
            if (datalist && datalist?.config && datalist?.config?.length && taskTypeIds?.length) {
                datalist?.config?.map(item => {
                    if (item?.name == notificationObject?.name && taskTypeIds?.includes(item?.task_type_id)) {
                        user_ids = [...user_ids, ...item?.user_ids]
                    }
                })
            }
            var uniqueUserIds = []
            if (user_ids?.length) {
                uniqueUserIds = user_ids.filter((number, index, array) => {
                    return array.indexOf(number) === index;
                });
            }
        }
    } catch (err) {
        var user_ids = []
        var uniqueUserIds = []
    }
    try {
        var title = ''
        var tast_type = notificationObject?.type ? notificationObject?.type + ' ' : ''
        if (notificationObject?.name == 'add task') {
            title = `new ${tast_type}task created by `
        } else if (notificationObject?.name == 'update task') {
            title = `${tast_type}Task has been updated by `
        } else if (notificationObject?.name == 'delete task') {
            title = `${tast_type}Task has been deleted by `
        } else if (notificationObject?.name == 'change task status') {
            if (notificationObject?.is_multiple_task) {
                title = 'List of Tasks statuses has been changed ' + (dataOfStatus && dataOfStatus?.name ? "to " + dataOfStatus?.name : '') + ' by '
            } else
                title = 'The task status has been changed ' + (dataOfStatus && dataOfStatus?.name ? "to " + dataOfStatus?.name : '') + ' by '
        }

        if (dataOfUser && dataOfUser?.name) {
            title += dataOfUser?.name
        }
    } catch (err) {
        var title = 'new action on task id ' + notificationObject?.task_id
    }
    const channelName = `task_notification_configuration`;
    const eventName = 'task_notification_configuration_create'
    if (uniqueUserIds && uniqueUserIds?.length) {
        pusher.trigger(channelName, eventName, {
            ...notificationObject,
            user_ids: uniqueUserIds,
            title: title,
            channelBrodcast: 5,
        });
        console.log('notification-sending--------->pusher', {
            ...notificationObject,
            user_ids: uniqueUserIds,
            title: title,
            channelBrodcast: 5,
        })
        console.log('notification-sending--------->pusher', pusher)

    } else {
        return console.log('notification-sending--------->no users specified in the settings for this notification')

    }
}
const changeSubmissionEngineerNotificationConfiguration = async (notificationObject) => {
    console.log('notification-sending--------->notificationObject', notificationObject)
    console.log('notification-sending--------->')
    const channelName = `change_submission_engineer_notification_configuration`;
    const eventName = 'change_submission_engineer_notification_configuration_create'
    pusher.trigger(channelName, eventName, {
        ...notificationObject,
        from_user_id: notificationObject?.from_user_id,
        to_user_id: notificationObject?.to_user_id,
        title: notificationObject?.title,
        channelBrodcast: 6,
    });
    // console.log('notification-sending--------->pusher', {
    //     ...notificationObject,
    //     user_ids: uniqueUserIds,
    //     title: title,
    //     channelBrodcast: 5,
    // })
    console.log('notification-sending--------->pusher', pusher)

}
module.exports = {
    sendSubmissionUpdatedNotification,
    sendApprovedOrRejectedRequestNotificationForSpecificUser,
    sendApprovedOrRejectedRequestNotificationForSpecificUserOverTime,
    externalTaskRequestNotification,
    taskNotificationConfiguration,
    changeSubmissionEngineerNotificationConfiguration
}
