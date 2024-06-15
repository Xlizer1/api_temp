const express   = require('express');
const router    = express.Router();
var service= require('./services')
router.get('/', (req, res) => {
                //service.getLogType(res=>{console.log(res)});
        res.json({app_name: 'ticket_system_is', ver:'1.0.0'})
        
});

module.exports = router