// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const userGroupController = require('./userGroupController')

router.get('/', (req, res) => {
    userGroupController.getUserGroups(req, response =>{
        res.json(response)
    })
});
router.get('/getGroupsById/:user_id', (req, res) => {
    userGroupController.getUserGroupsById(req, response =>{
        res.json(response)
    })
});
router.post('/', (req, res) => {
    userGroupController.createUserGroups(req, response =>{
        res.json(response)
    })
});


module.exports = router