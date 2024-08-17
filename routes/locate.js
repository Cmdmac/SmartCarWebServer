const express = require('express');
const router = express.Router();
const locateByRSSI = require('../lib/locateByRSSI');
const {loadBeacons} = require('../lib/json2map');
const {PathFinding} = require("astarjs");

const beacons = new Map();
loadBeacons('./indoorMap.json').then((data) => {
    data.forEach(beacon => {
        console.log('load beacon ' + beacon.mac + " x=" + beacon.x + ",y=" + beacon.y);
        beacons.set(beacon.mac, beacon);
    })
    
}).catch((err) => {
    console.log(err);
});


router.get('/', function(req, res, next) {
    const mac1 = req.query.mac1;
    const mac2 = req.query.mac2;
    const mac3 = req.query.mac3;

    // console.log('mac1=' + mac1 + ',mac2=' + mac2 + ',mac3=' + mac3);
    const beacon1 = beacons.get(mac1);
    const beacon2 = beacons.get(mac2);
    const beacon3 = beacons.get(mac3);
    console.log(beacon1);
    console.log(beacon2);
    console.log(beacon3);
    let location = locateByRSSI(beacon1, beacon2, beacon3, req.query.rssi1, req.query.rssi2, req.query.rssi3);
    // console.log(location);
    if (location) {
        res.send({code: 200, msg: 'success', location: location});
    } else {
        res.send({code: 400, msg: 'error', location: location});
    }

});

module.exports = router;
