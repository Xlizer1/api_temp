

var model = require('./settingsModels')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
var getRes = require('../../helper/common').getResponse

function getDefaultSettings(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            model.getDefaultSettings(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

function getCustomerCareSettings(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            model.getCustomerCareSettings(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

function getInstallationSettings(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            model.getInstallationSettings(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

function updateCustomerCareSetting(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            var defaultValues = req.body
            var stringJson = JSON.stringify(defaultValues)

            if (data.roles_id.includes(5)) {
                model.updateCustomerCareSetting(stringJson, result => {
                    if (result) response(getRes(true, { message: msg.inserted }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}

function updateInstallationSetting(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            var defaultValues = req.body
            var stringJson = JSON.stringify(defaultValues)

            if (data.roles_id.includes(5)) {
                model.updateInstallationSetting(stringJson, result => {
                    if (result) response(getRes(true, { message: msg.inserted }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}

function updateTelegramChannelSetting(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            var defaultValues = req.body
            var stringJson = JSON.stringify(defaultValues)

            if (data.roles_id.includes(58)) {
                model.updateTelegramChannelSetting(stringJson, result => {
                    if (result) response(getRes(true, { message: result }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}
function updateTaskNotificationConfigurationSetting(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            
            try{
              var dataParams=req&&req?.body&&req?.body?.dataParams?req?.body?.dataParams:null  
            if(dataParams){
                dataParams = JSON.stringify(dataParams)
            }
            }catch(err){
                dataParams=null
            }
            if(!dataParams){
                return response(getRes(false, null, "You must send at least one params!"))
            }

            if (data.roles_id.includes(93)) {
                model.updateTaskNotificationConfigurationSetting(dataParams, result => {
                    if (result) response(getRes(true, { message: result }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}

function getLatestMobileAppVersion(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            model.getLatestMobileAppVersion(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

function updateLatestMobileAppVersion(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {
            var latest_mobile_app_version = ""
            if (req && req.body && req.body.latest_mobile_app_version) {
                var latest_mobile_app_version = req.body.latest_mobile_app_version
            }

            if (data.roles_id.includes(5)) {
                model.updateLatestMobileAppVersion(latest_mobile_app_version, result => {
                    if (result) response(getRes(true, { message: msg.inserted }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}


function getStatusesWorthSendingEmailsToCustomerSettings(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            model.getStatusesWorthSendingEmailsToCustomerSettings(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

function updateStatusesWorthSendingEmailsToCustomerSettings(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            var defaultValues = req.body
            var stringJson = JSON.stringify(defaultValues)

            if (data.roles_id.includes(5)) {
                model.updateStatusesWorthSendingEmailsToCustomerSettings(stringJson, result => {
                    if (result) response(getRes(true, { message: msg.inserted }));
                    else response(getRes(false, null, msg.error))
                })
            } else response(getRes(false, null, msg.failedCreate))

        } else response(getRes(false, null, msg.invalidToken))
    })
}

function updatePendingMobileSubmissionNotifications(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      const {
        daysToCheckSubMissonOpen,
        subMissionOpenDurationInHours,
        subMissionOpenDurationInMinutes,
      } = req.body;

      if (data.roles_id.includes(5)) {
        model.updatePendingMobileSubmissionNotifications(
          {
            daysToCheckSubMissonOpen,
            subMissionOpenDurationInHours,
            subMissionOpenDurationInMinutes,
          },
          (result) => {
            if (result) response(getRes(true, { message: msg.inserted }));
            else response(getRes(false, null, msg.error));
          }
        );
      } else response(getRes(false, null, msg.failedCreate));
    } else response(getRes(false, null, msg.invalidToken));
  });
}

function getPendingMobileSubmissionNotifications(req, response) {
    auth.verify(req.headers['jwt'], data => {
        if (data) {

            model.getPendingMobileSubmissionNotifications(result => {
                if (result) response(getRes(true, result))
                else response(getRes(false, msg.invalidToken))
            })

        } else response(getRes(false, msg.invalidToken))
    })
}

module.exports = {
    getDefaultSettings
    , getCustomerCareSettings
    , getInstallationSettings
    , updateCustomerCareSetting
    , updateInstallationSetting
    , getLatestMobileAppVersion
    , updateLatestMobileAppVersion
    , getStatusesWorthSendingEmailsToCustomerSettings
    , updateStatusesWorthSendingEmailsToCustomerSettings
    , updateTelegramChannelSetting
    , updateTaskNotificationConfigurationSetting
    , updatePendingMobileSubmissionNotifications
    , getPendingMobileSubmissionNotifications
}
