// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const userController = require('./userController')

router.post('/user', (req, res) => {
    userController.createUsers(req, response =>{
        res.json(response)
    })
});

router.put('/user/:user_id', (req, res) => {
    userController.updateUser(req, response =>{
        res.json(response)
    })
});

router.put('/user/status/:user_id', (req, res) => {
    userController.enableUser(req, response =>{
        res.json(response)
    })
});

router.get('/user/:user_id', (req, res) => {
    var allUsers = false
    userController.getUsers(allUsers,req, response =>{
        res.json(response)
    })
});

router.get('/users', (req, res) => {
    var allUsers = true
    userController.getUsers(allUsers,req, response =>{
        res.json(response)
    })
});

router.get('/users_report', (req, res) => {
    var allUsers = true
    userController.getUsersReport(allUsers,req, response =>{
        res.json(response)
    })
});
router.get('/download', (req, res) => {
    var allUsers = true
    userController.downloadUsers(allUsers,req, response =>{
        res.download(response.data);
    })
});
router.get('/userslist', (req, res) => {
    
    userController.getUsersList(req, response =>{
        res.json(response)
    })
});

router.put('/change_password', (req, res) => {
    userController.changePassword(req, response =>{
        res.json(response)
    })
});

router.post('/permissions/:user_id', (req, res) => {
    userController.setPermission(req, response =>{
        res.json(response)
    })
});
router.post('/expo_push_token', (req, res) => {
    userController.setExpoPushToken(req, response =>{
        res.json(response)
    })
});
router.post('/copy_permissions_for_another_users',(req,res)=>{
    userController.copyPermissionsForAnotherUsers(req, response =>{
        res.json(response)
    })
});
router.put('/user/allow_send_email/:user_id',(req,res)=>{
    userController.handleAllowSendEmail(req, response =>{
        res.json(response)
    })
});


module.exports = router