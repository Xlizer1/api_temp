var executeQuery = require('../../helper/common').executeQuery


function getDefaultSettings(callback){
    var sql = 'SELECT `field_value`,`field_name` FROM `settings` '
   
    executeQuery(sql,'getDefaultSetting',result=>{
        if(result.length > 0) callback(result)
        else callback(false)
    })
}

function getCustomerCareSettings(callback){
    var sql = 'SELECT `field_value` FROM `settings` WHERE `field_name`="CUSTOMER_CARE_TASK_DEFAULT" '
   
    executeQuery(sql,'getCustomerCareSetting',result=>{
        if(result.length > 0) callback(result)
        else callback(false)
    })
}

function getInstallationSettings(callback){
    var sql = 'SELECT `field_value` FROM `settings` WHERE `field_name`="INSTALLATION_TASK_DEFAULT" '
   
    executeQuery(sql,'getInstallationSetting',result=>{
        if(result.length > 0) callback(result)
        else callback(false)
    })
}


function updateCustomerCareSetting(jsonData,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+jsonData+'\' WHERE `field_name`="CUSTOMER_CARE_TASK_DEFAULT"'
    executeQuery(sql,'updateCustomerCareDefaults',result=>{callback(result)})
}

function updateInstallationSetting(jsonData,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+jsonData+'\' WHERE `field_name`="INSTALLATION_TASK_DEFAULT"'
    executeQuery(sql,'updateInstallationDefaults',result=>{callback(result)})
}
function updateTelegramChannelSetting(jsonData,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+jsonData+'\' WHERE `field_name`="TELEGRAM_CHANNELS"'
    executeQuery(sql,'updateTelegramChannelSetting',result=>{
        if(result&&result.affectedRows>0)
        callback(result)
        else{
       var sqlInsert=`
       insert into settings 
        ( 
            field_name,
            field_value
        ) 
        values(
            "TELEGRAM_CHANNELS",
            '${jsonData}'
        )
        `
        executeQuery(sqlInsert,'insertTelegramChannelSetting',result=>{
            if(result&&result.insertId){
                callback(true)
            }else
            callback(false)
        })

        }
    })
}
function updateTaskNotificationConfigurationSetting(jsonData,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+jsonData+'\' WHERE `field_name`="TASK_NOTIFICATION_SYSTEMS"'
    executeQuery(sql,'updateTaskNotificationConfigurationSetting',result=>{
        if(result&&result.affectedRows>0)
        callback(result)
        else{
       var sqlInsert=`
       insert into settings 
        ( 
            field_name,
            field_value
        ) 
        values(
            "TASK_NOTIFICATION_SYSTEMS",
            '${jsonData}'
        )
        `
        executeQuery(sqlInsert,'insertIntoTaskNotificationConfigurationSetting',result=>{
            if(result&&result.insertId){
                callback(true)
            }else
            callback(false)
        })

        }
    })
}
function getLatestMobileAppVersion(callback){
    var sql = 'SELECT `field_value` FROM `settings` WHERE `field_name`="LATEST_MOBIEL_APP_VERSION" '
   
    executeQuery(sql,'getCustomerCareSetting',result=>{
        if(result.length > 0) callback(result)
        else callback(false)
    })
}

function updateLatestMobileAppVersion(fieldValue,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+fieldValue+'\' WHERE `field_name`="LATEST_MOBIEL_APP_VERSION"'
    executeQuery(sql,'updateLatestMobileAppVersion',result=>{callback(result)})
}

function getStatusesWorthSendingEmailsToCustomerSettings(callback){
    var sql = 'SELECT `field_value` FROM `settings` WHERE `field_name`="STATUSES_WORTH_SENDING_EMAILS_TO_CUSTOMER" '
   
    executeQuery(sql,'getStatusesWorthSendingEmailsToCustomerSettings',result=>{
        if(result.length > 0) callback(result)
        else callback(false)
    })
}
function updateStatusesWorthSendingEmailsToCustomerSettings(fieldValue,callback){
    var sql='UPDATE `settings` SET `field_value`=\''+fieldValue+'\' WHERE `field_name`="STATUSES_WORTH_SENDING_EMAILS_TO_CUSTOMER"'
    executeQuery(sql,'updateStatusesWorthSendingEmailsToCustomerSettings',result=>{callback(result)})
} 

function updatePendingMobileSubmissionNotifications(
    {
      daysToCheckSubMissonOpen,
      subMissionOpenDurationInHours,
      subMissionOpenDurationInMinutes,
    },
    callback
  ) {
    var sql = `
      UPDATE 
          settings
      SET
          field_value = CASE
              WHEN field_name = 'DAYS_TO_CHECK_SUB_MISSION_OPEN' THEN '${daysToCheckSubMissonOpen}'
              WHEN field_name = 'SUB_MISSION_OPEN_DURATION_IN_HOURS' THEN '${subMissionOpenDurationInHours}'
              WHEN field_name = 'OPEN_SUB_MISSION_NOTIFICATION_FREQUENCY_IN_MIN' THEN '${subMissionOpenDurationInMinutes}'
          END
    `;
  
    executeQuery(
      sql,
      "updateStatusesWorthSendingEmailsToCustomerSettings",
      (result) => {
        callback(result);
      }
    );
} 

function getPendingMobileSubmissionNotifications(callback) {
  const field_names = [
    'DAYS_TO_CHECK_SUB_MISSION_OPEN',
    'SUB_MISSION_OPEN_DURATION_IN_HOURS',
    'OPEN_SUB_MISSION_NOTIFICATION_FREQUENCY_IN_MIN',
  ];
  var sql = `SELECT *
    FROM settings
    WHERE 
        field_name IN (${field_names.map(e => JSON.stringify(e))});    
    `;

  executeQuery(
    sql,
    "getPendingMobileSubmissionNotifications",
    (result) => {
      callback(result);
    }
  );
}

module.exports={
    getDefaultSettings
    ,getCustomerCareSettings
    ,getInstallationSettings
    ,updateCustomerCareSetting
    ,updateInstallationSetting
    ,getLatestMobileAppVersion
    ,updateLatestMobileAppVersion
    ,getStatusesWorthSendingEmailsToCustomerSettings
    ,updateStatusesWorthSendingEmailsToCustomerSettings
    ,updateTelegramChannelSetting
    ,updateTaskNotificationConfigurationSetting
    ,updatePendingMobileSubmissionNotifications
    ,getPendingMobileSubmissionNotifications
}