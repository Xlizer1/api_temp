
const express   = require('express');
const router    = express.Router();
const notificationController = require('./notificationController')

router.get('/', (req, res) => {
    notificationController.getNotifications(req, response =>{
        res.json(response)
    })
});

router.post('/read_notification/:activity_id', (req, res) => {
    notificationController.setNotificationViewed(req, response =>{
        res.json(response)
    })
});

router.post('/clear_notifications', (req, res) => {
    notificationController.clearNotifications(req, response =>{
        res.json(response)
    })
});

router.get('/get_top_five_un_read_notification', (req, res) => {
    notificationController.getTopFiveUnReadNotification(req, response =>{
        res.json(response)
    })
});

module.exports = router