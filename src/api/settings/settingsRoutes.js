// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const controller = require('./settingsController')


router.get('/default_settings', (req, res) => {
    controller.getDefaultSettings(req, response =>{
        res.json(response)
    })
});

router.get('/customer_care_settings', (req, res) => {
    controller.getCustomerCareSettings(req, response =>{
        res.json(response)
    })
});

router.get('/installation_settings', (req, res) => {
    controller.getInstallationSettings(req, response =>{
        res.json(response)
    })
});

router.put('/customer_care_settings', (req, res) => {
    controller.updateCustomerCareSetting(req, response =>{
        res.json(response)
    })
});
router.put('/installation_settings', (req, res) => {
    controller.updateInstallationSetting(req, response =>{
        res.json(response)
    })
});

router.put('/telegram_channel_settings', (req, res) => {
    controller.updateTelegramChannelSetting(req, response =>{
        res.json(response)
    })
});
router.put('/task_notification_configuration_settings', (req, res) => {
    controller.updateTaskNotificationConfigurationSetting(req, response =>{
        res.json(response)
    })
});

router.get('/latest_mobile_app_version', (req, res) => {
    controller.getLatestMobileAppVersion(req, response =>{
        res.json(response)
    })
});

router.put('/latest_mobile_app_version', (req, res) => {
    controller.updateLatestMobileAppVersion(req, response =>{
        res.json(response)
    })
});

router.get('/statuses_worth_sending_emails_to_customer', (req, res) => {
    controller.getStatusesWorthSendingEmailsToCustomerSettings(req, response =>{
        res.json(response)
    })
});

router.put('/statuses_worth_sending_emails_to_customer', (req, res) => {
    controller.updateStatusesWorthSendingEmailsToCustomerSettings(req, response =>{
        res.json(response)
    })
});

router.put('/pending_mobile_nubmission_notifications', (req, res) => {
    controller.updatePendingMobileSubmissionNotifications(req, response =>{
        res.json(response)
    })
});

router.get('/pending_mobile_nubmission_notifications', (req, res) => {
    controller.getPendingMobileSubmissionNotifications(req, response =>{
        res.json(response)
    })
});

module.exports = router