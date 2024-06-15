
const express   = require('express');
const router    = express.Router();
const depController = require('./depController')

router.post('/department', (req, res) => {
    depController.createDepartment(req, response =>{
        res.json(response)
    })
});

router.delete('/department/:dep_id', (req, res) => {
    depController.deleteDepartment(req, response =>{
        res.json(response)
    })
});

router.put('/department/:dep_id', (req, res) => {
    depController.updateDepartment(req, response =>{
        res.json(response)
    })
});

router.get('/departments', (req, res) => {
    depController.getDepartments(true,req, response =>{
        res.json(response)
    })
});

router.get('/department/:dep_id', (req, res) => {
    depController.getDepartments(false,req, response =>{
        res.json(response)
    })
});

module.exports = router