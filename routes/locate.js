const express = require('express');
const router = express.Router();
const locateByRSSI = require('../lib/locateByRSSI');
const {loadBeacons} = require('../lib/json2map');
const {PathFinding} = require("astarjs");
const httpwsbridge = require('../lib/httpwsbridge');

const beacons = new Map();
loadBeacons('./indoorMap.json').then((data) => {
    data.forEach(beacon => {
        console.log('load beacon ' + beacon.name + " " + beacon.mac + " x=" + beacon.x + ",y=" + beacon.y);
        beacons.set(beacon.mac, beacon);
    })
    
}).catch((err) => {
    console.log(err);
});

let globalLocation = {x: -1, y: -1};

router.get('/', function(req, res, next) {
    
    const mac1 = req.query.mac1;
    const mac2 = req.query.mac2;
    const mac3 = req.query.mac3;
    const mac4 = req.query.mac4;
    const mac5 = req.query.mac5;

    // console.log('mac1=' + mac1 + ',mac2=' + mac2 + ',mac3=' + mac3);
    const beacon1 = beacons.get(mac1);
    const beacon2 = beacons.get(mac2);
    const beacon3 = beacons.get(mac3);
    const beacon4 = beacons.get(mac4);
    const beacon5 = beacons.get(mac5);

    console.log("name1=" + beacon1.name + "&mac1=" + beacon1.mac);
    console.log("name2=" + beacon2.name + "&mac2=" + beacon2.mac);
    console.log("name3=" + beacon3.name + "&mac3=" + beacon3.mac);
    console.log("name4=" + beacon4.name + "&mac4=" + beacon4.mac);
    console.log("name5=" + beacon3.name + "&mac5=" + beacon3.mac);
    // console.log(beacon2);
    // console.log(beacon3);
    let locations = [];
    let location = locateByRSSI(beacon1, beacon2, beacon3, req.query.rssi1, req.query.rssi2, req.query.rssi3);
    locations.push(location);
    if (beacon4 != undefined && beacon5 != undefined) {
        let location2 = locateByRSSI(beacon2, beacon3, beacon4, req.query.rssi2, req.query.rssi3, req.query.rssi4);
        let location3 = locateByRSSI(beacon3, beacon4, beacon5, req.query.rssi3, req.query.rssi4, req.query.rssi5);
        if (location2 != undefined) {
            locations.push(location2);
        }
        if (location3 != undefined) {
            locations.push(location3);
        }
    }

    let x = 0;
    let y = 0;
    locations.forEach(l => {
        x += l.x;
        y += l.y;
    });

    x = parseFloat((x / locations.length).toFixed(2));
    y = parseFloat((y / locations.length).toFixed(2));

    console.log('x=' + x + ',y=' + y);

    // console.log(location);
    if (location) {
        globalLocation = location;
        httpwsbridge.sendMsgToWebClients({type: 100, data: [x, y]});
        res.send({code: 200, msg: 'success', location: location});

    } else {
        res.send({code: 400, msg: 'error', location: location});
    }

});

router.get('/get', function(req, res, next) {
    res.send({code: 200, msg: 'success', location: globalLocation});
});

module.exports = router;
