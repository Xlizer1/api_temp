// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const groupController = require('./groupController')

router.get('/', (req, res) => {
    groupController.getGroups(req, response =>{
        res.json(response)
    })
});
router.get('/list', (req, res) => {
    groupController.getGroupsList(req, response =>{
        res.json(response)
    })
});
router.post('/', (req, res) => {
    groupController.createGroup(req, response =>{
        res.json(response)
    })
});

router.put('/:group_id', (req, res) => {
    groupController.updateGroup(req, response =>{
        res.json(response)
    })
});

router.delete('/:group_id', (req, res) => {
    groupController.deleteGroup(req, response =>{
        res.json(response)
    })
});

module.exports = router