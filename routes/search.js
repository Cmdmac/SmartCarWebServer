const express = require('express');
const router = express.Router();
const {loadMap, point2Grid} = require('../lib/json2map');
const PathFinding  = require('astarjs').PathFinding;

let map = {};
loadMap('./indoorMap.json').then((data) => {
    map = data;
	// console.log(data);
    // for(let i = 0; i < bestPath.length; i++) {
    //     data[bestPath[i].row][bestPath[i].col] = 2;
    // }
	// for(let i = 0; i < data.length; i++) {
    //             let s = "[";
    //             for (let j = 0; j < data[i].length; j++) {
    //                 s += (data[i][j] === 0? ' ': data[i][j]);
    //                 s += ",";
    //             }
    //             s += "]";
    //             console.log(s);
    //         }
    // let grid = point2Grid(250, 150);
    // console.log("point=250,150&grid=" + grid.x + "," + grid.y);
}).catch((err) => {
    console.log(err);
});

router.get('/', function(req, res, next) {
    let startX = parseFloat(req.query.startX);
    let startY = parseFloat(req.query.startY);
    let endX = parseFloat(req.query.endX);
    let endY = parseFloat(req.query.endY);
    let pathFindingManager = new PathFinding();
    pathFindingManager.setWalkable(0); // or this.pathFindingManager.setWalkable(0, 10, 11);
    let startPoint = point2Grid(startX, startY);
    let endPoint = point2Grid(endX, endY);
    console.log(startPoint);
    console.log(endPoint);
    pathFindingManager.setStart({row: startPoint.x, col: startPoint.y});
    pathFindingManager.setEnd({row: endPoint.x, col: endPoint.y});
    let bestPath = pathFindingManager.find(map).map(item=>{
        return [item.row, item.col];
    })
    console.log(bestPath);
    let respond = {code: 200, data: bestPath};
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send(respond);
});
module.exports = router;
