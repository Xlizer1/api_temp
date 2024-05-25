const express   = require('express');
const router    = express.Router();
const loginController = require('./loginController')

router.post('/', (req, res) => {
    
    loginController.createToken(req, response =>{
        res.json(response)
    })
});

router.post('/token', (req, res) => {
    loginController.checkToken(req, response =>{
        res.json(response)
    })
});

module.exports = router