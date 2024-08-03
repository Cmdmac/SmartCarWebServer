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

const map2grid = require('./lib/map2grid');
const PathFinding  = require('astarjs').PathFinding;


map2grid('./indoorMap.json').then((data) => {

	let pathFindingManager = new PathFinding();
	pathFindingManager.setWalkable(0); // or this.pathFindingManager.setWalkable(0, 10, 11); 
	pathFindingManager.setEnd({row: 72, col: 92});
	pathFindingManager.setStart({row: 10, col: 28});
	let bestPath = pathFindingManager.find(data);
	console.log(bestPath);
	for(let i = 0; i < bestPath.length; i++) {
		data[bestPath[i].row][bestPath[i].col] = 2;
	}
	// console.log(data);

	for(let i = 0; i < data.length; i++) {
                let s = "[";
                for (let j = 0; j < data[i].length; j++) {
                    s += (data[i][j] === 0? ' ': data[i][j]);
                    s += ",";
                }
                s += "]";
                console.log(s);
            }
}).catch((err) => {

});
