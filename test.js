// const doubaoTTS = require('./lib/doubaoTTS');
// doubaoTTS.getByWs("哈哈，你真好笑");

// function checkEndianness() {
//   const buffer = Buffer.alloc(2);
//   buffer.writeUInt16BE(0xABCD);

//   if (buffer.readUInt16BE(0) === 0xABCD) {
//     console.log('系统是大端序');
//   } else if (buffer.readUInt16LE(0) === 0xABCD) {
//     console.log('系统是小端序');
//   } else {
//     console.log('无法确定字节序');
//   }
// }

// checkEndianness();

// const a = 2.33
// const b = 10;
// const c = a + b * 2;
// console.log(c);

// const {loadMap, loadBeacons, point2Grid} = require('./lib/json2map');
// const PathFinding  = require('astarjs').PathFinding;
//
// loadBeacons('./indoorMap.json').then((data) => {
//     console.log(data);
// });

const {loadMap} = require("./lib/json2map");

const svg2json = require("./lib/svg2json");

svg2json.svg2json('./xhy.svg', 'indoorMap.json');

// loadMap('./indoorMap.json').then((data) => {
//     // console.log(data);
//     // for(let i = 0; i < bestPath.length; i++) {
//     //     data[bestPath[i].row][bestPath[i].col] = 2;
//     // }
//     for(let i = 0; i < data.length; i++) {
//                 let s = "[";
//                 for (let j = 0; j < data[i].length; j++) {
//                     s += (data[i][j] === 0? ' ': data[i][j]);
//                     s += ",";
//                 }
//                 s += "]";
//                 console.log(s);
//             }
//     // let grid = point2Grid(250, 150);
//     // console.log("point=250,150&grid=" + grid.x + "," + grid.y);
// }).catch((err) => {

// });