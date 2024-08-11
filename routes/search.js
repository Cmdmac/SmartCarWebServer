const express = require('express');
const router = express.Router();
const json2map = require('../lib/json2map');
const PathFinding  = require('astarjs').PathFinding;

let map = {};
json2map.loadMap('./indoorMap.json').then((data) => {
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

function grid2String(startPos, endPos, bestPath) {
    // console.log(map);
    console.log("from=" + JSON.stringify(startPos) + ",end=" + JSON.stringify(endPos));

    console.log(bestPath);
   
    // map[startPos.x][startPos.y] = 3;
    // map[endPos.x][endPos.y] = 4;
    for(let i = 0; i < map.length; i++) {
        let s = "[";
        for (let j = 0; j < map[i].length; j++) {
            if (i == startPos.x && j == startPos.y) {
                s += '3';
            } else if (i == endPos.x && j == endPos.y) {
                s += '4';
            } else {
                let find = false;
                for(let k = 0; k < bestPath.length; k++) {
                    let p = bestPath[k];
                    if (p.row == i && p.col == j) {
                        s += '2';
                        find = true;
                        break;
                    }
                }
                if (find == false) {
                    s += (map[i][j] === 0? ' ': map[i][j]);
                }
                
            }
            s += ",";
           
        }
        s += "]";
        console.log(s);
    }
}

router.get('/', function(req, res, next) {
    let startX = parseFloat(req.query.startX);
    let startY = parseFloat(req.query.startY);
    let endX = parseFloat(req.query.endX);
    let endY = parseFloat(req.query.endY);
    let pathFindingManager = new PathFinding();
    pathFindingManager.setWalkable(0); // or this.pathFindingManager.setWalkable(0, 10, 11);
    let startPoint = json2map.point2Grid(startX, startY);
    let endPoint = json2map.point2Grid(endX, endY);
    console.log(startPoint);
    console.log(endPoint);
    pathFindingManager.setStart({row: startPoint.x, col: startPoint.y});
    pathFindingManager.setEnd({row: endPoint.x, col: endPoint.y});
    let bestPath = pathFindingManager.find(map);
    grid2String(startPoint, endPoint, bestPath);
    let naviPath = bestPath.map(item=>{
        // console.log(item);
        let p = json2map.grid2point(item.row, item.col);
        // console.log(p);
        return [p.x, p.y];
        // return [item.row, item.col];
    })
    let respond = {code: 200, data: naviPath};
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send(respond);
});
module.exports = router;
