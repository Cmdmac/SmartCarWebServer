var express = require('express');
var router = express.Router();
var locateByRSSI = require('../locateByRSSI');

/* GET home page. */
router.get('/', function(req, res, next) {
    let location = locateByRSSI(req.query.rssi1, req.query.rssi2, req.query.rssi3);
    console.log(location);
    res.send({'location': location});
});

module.exports = router;
