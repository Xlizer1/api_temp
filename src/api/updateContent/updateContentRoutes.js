// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const updateContentController = require('./updateContentController')

router.get('/', (req, res) => {
    updateContentController.getUpdateContents(req, response =>{
        res.json(response)
    })
});
router.get('/list', (req, res) => {
    updateContentController.getUpdateContentList(req, response =>{
        res.json(response)
    })
});
router.get('/list_of_versions', (req, res) => {
    updateContentController.getUpdateContentListOfVersions(req, response =>{
        res.json(response)
    })
});
router.post('/', (req, res) => {
    updateContentController.createUpdateContent(req, response =>{
        res.json(response)
    })
});

router.put('/:update_content_id', (req, res) => {
    updateContentController.updateUpdateContent(req, response =>{
        res.json(response)
    })
});

router.delete('/:update_content_id', (req, res) => {
    updateContentController.deleteUpdateContent(req, response =>{
        res.json(response)
    })
});

module.exports = router