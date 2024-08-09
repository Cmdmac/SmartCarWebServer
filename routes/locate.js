const express = require('express');
const router = express.Router();
const locateByRSSI = require('../lib/locateByRSSI');
const {loadBeacons} = require('./lib/json2map');
const {PathFinding} = require("astarjs");

const beacons = [];
loadBeacons('./indoorMap.json').then((data) => {
    beacons.concat(data);
}).catch((err) => {

});

/* GET home page. */
router.get('/', function(req, res, next) {
    let location = locateByRSSI(req.query.rssi1, req.query.rssi2, req.query.rssi3);
    console.log(location);
    res.send({'location': location});
});

module.exports = router;
