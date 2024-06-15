const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {

        res.json({app_name: 'ticket_system_is_test_ver', ver:'1.0.0'})

});

module.exports = router