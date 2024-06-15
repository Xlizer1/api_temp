// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const rolesController = require('./rolesController')

router.get('/', (req, res) => {
    rolesController.getRoles(req, response =>{
        res.json(response)
    })
});

router.post('/', (req, res) => {
    rolesController.setRoles(req, response =>{
        res.json(response)
    })
});


module.exports = router