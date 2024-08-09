const fs = require('fs');

function findBoundingRectangle(coordinates) {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const { x, y } of coordinates) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    return {
        topLeft: { x: minX, y: minY },
        bottomRight: { x: maxX, y: maxY }
    };
}

function isLineIntersectRectangle(lineStart, lineEnd, rectTopLeft, rectBottomRight) {
    // 分别获取线段的起点和终点的 x、y 坐标
    const startX = lineStart.x;
    const startY = lineStart.y;
    const endX = lineEnd.x;
    const endY = lineEnd.y;

    // 分别获取矩形的左上角和右下角的 x、y 坐标
    const rectLeft = rectTopLeft.x;
    const rectTop = rectTopLeft.y;
    const rectRight = rectBottomRight.x;
    const rectBottom = rectBottomRight.y;

    // 计算线段所在直线的参数方程
    const dx = endX - startX;
    const dy = endY - startY;

    // 检查线段的两个端点是否在矩形内
    if (isPointInRectangle(lineStart, rectTopLeft, rectBottomRight) || isPointInRectangle(lineEnd, rectTopLeft, rectBottomRight)) {
        return true;
    }

    // 对于矩形的四条边，分别判断线段与边是否相交
    if (doLinesIntersect({ x: rectLeft, y: rectTop }, { x: rectRight, y: rectTop }, lineStart, lineEnd) ||
        doLinesIntersect({ x: rectRight, y: rectTop }, { x: rectRight, y: rectBottom }, lineStart, lineEnd) ||
        doLinesIntersect({ x: rectRight, y: rectBottom }, { x: rectLeft, y: rectBottom }, lineStart, lineEnd) ||
        doLinesIntersect({ x: rectLeft, y: rectBottom }, { x: rectLeft, y: rectTop }, lineStart, lineEnd)) {
        return true;
    }

    return false;
}

function isPointInRectangle(point, rectTopLeft, rectBottomRight) {
    const x = point.x;
    const y = point.y;

    const rectLeft = rectTopLeft.x;
    const rectTop = rectTopLeft.y;
    const rectRight = rectBottomRight.x;
    const rectBottom = rectBottomRight.y;

    return x >= rectLeft && x <= rectRight && y >= rectTop && y <= rectBottom;
}

function doLinesIntersect(line1Start, line1End, line2Start, line2End) {
    const orientation1 = getOrientation(line1Start, line1End, line2Start);
    const orientation2 = getOrientation(line1Start, line1End, line2End);
    const orientation3 = getOrientation(line2Start, line2End, line1Start);
    const orientation4 = getOrientation(line2Start, line2End, line1End);

    if (orientation1!== orientation2 && orientation3!== orientation4) {
        return true;
    }

    // 特殊情况：共线且重叠
    if (orientation1 === 0 && isOnSegment(line1Start, line2Start, line1End)) {
        return true;
    }

    if (orientation2 === 0 && isOnSegment(line1Start, line2End, line1End)) {
        return true;
    }

    if (orientation3 === 0 && isOnSegment(line2Start, line1Start, line2End)) {
        return true;
    }

    if (orientation4 === 0 && isOnSegment(line2Start, line1End, line2End)) {
        return true;
    }

    return false;
}

function getOrientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) {
        return 0;  // 共线
    }

    return (val > 0)? 1 : 2;  // 顺时针或逆时针方向
}

function isOnSegment(p, q, r) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
        return true;
    }
    return false;
}

// function isLineIntersectLine(line1Start, line1End, line2Start, line2End) {
//     const denominator = (line1End.y - line1Start.y) * (line2End.x - line2Start.x) - (line1End.x - line1Start.x) * (line2End.y - line2Start.y);
//
//     if (denominator === 0) {
//         return false;
//     }
//
//     const ua = ((line2End.x - line2Start.x) * (line1Start.y - line2Start.y) - (line2End.y - line2Start.y) * (line1Start.x - line2Start.x)) / denominator;
//     const ub = ((line1End.x - line1Start.x) * (line1Start.y - line2Start.y) - (line1End.y - line1Start.y) * (line1Start.x - line2Start.x)) / denominator;
//
//     if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
//         return true;
//     }
//
//     return false;
// }

function gridIndex(start, end, step) {
    const ix =  Math.abs(start.x - end.x) / step;
    const iy = Math.abs(start.y - end.y) / step;
    return {x: parseInt(ix), y: parseInt(iy)};
}

function createGridRectangle(topLeft, row, col, step) {
    const topLeftX = topLeft.x + row * step;
    const topLeftY = topLeft.y + col * step;
    const bottomRightX = topLeftX + step;
    const bottomRightY = topLeftY + step;
    // console.log(typeof topLeft.x);
    // console.log("topLeft.x=" + topLeft.x + ",topLeft.y=" + topLeft.y + ",topLeftX=" + topLeftX + ",topLeftY=" + topLeftY);

    // console.log("createGridRectangle:topLeft=" + topLeft.x + "," + topLeft.y + ",row=" + row + ",col=" + col + ",step=" + step + "," + topLeftX + "," + topLeftY + "," + bottomRightX + "," + bottomRightY)
    return {topLeft: {x: topLeftX, y: topLeftY}, bottomRight: {x: bottomRightX, y: bottomRightY}};
}

function mark(topLeft, startPoint, endPoint, j, k, step, gridMap) {
    const grid = createGridRectangle(topLeft, j, k, step);
    // console.log(JSON.stringify(mapBoundRect.topLeft) + ",j=" + j + ",k=" + k + ",step=" + step + ",grid=" + JSON.stringify(grid));
    if (isLineIntersectRectangle(startPoint, endPoint, grid.topLeft, grid.bottomRight)) {
        // console.log("mark j=" + j + ",k=" + k);
        gridMap[j][k] = 1;
    }
}

const step = 20;

function splitMapToGrid(coordinates, mapBoundRect) {
    const width = Math.abs(mapBoundRect.topLeft.x - mapBoundRect.bottomRight.x);
    const height = Math.abs(mapBoundRect.topLeft.y - mapBoundRect.bottomRight.y);
    console.log("width=" + width +",height=" + height);

    const rows = Math.ceil(width / step);
    const cols = Math.ceil(height / step);

    console.log(mapBoundRect);
    console.log("rows=" + rows + ",cols=" + cols);
    // console.log(cols);

    const gridMap = Array.from({ length: rows }, () => Array(cols).fill(0));

    // step by step check which grid
    for (var i = 0; i + 2 < coordinates.length; i+=2) {
        // console.log("i=" + i + "," + JSON.stringify(coordinates[i]) + JSON.stringify(coordinates[i + 1]));
        const gi = gridIndex(coordinates[i], mapBoundRect.topLeft, step);
        // const startGrid = createGridRectangle(gi.x, gi.y, step);
        const gi1 = gridIndex(coordinates[i + 1], mapBoundRect.topLeft, step);
        // const endGrid = createGridRectangle(gi.x, gi.y, step);

        // console.log("ii=" + i + "," + JSON.stringify(gi) + JSON.stringify(gi1));
        if (gi.x <= gi1.x && gi.y <= gi1.y) {
            for (var j = gi.x; j <= gi1.x && j < rows; j++) {
                for (var k = gi.y; k <= gi1.y && k < cols; k++) {
                    mark(mapBoundRect.topLeft, coordinates[i], coordinates[i + 1], j, k, step, gridMap);
                }
            }
        } else if (gi.x <= gi1.x && gi.y >= gi1.y) {
            for (var j = gi.x; j <= gi1.x && j < rows; j++) {
                for (var k = gi1.y; k <= gi.y && k < cols; k++) {
                    mark(mapBoundRect.topLeft, coordinates[i], coordinates[i + 1], j, k, step, gridMap);
                }
            }
        } else if (gi.x >= gi1.x && gi.y >= gi1.y) {
            for (var j = gi1.x; j <= gi.x && j < rows; j++) {
                for (var k = gi1.y; k <= gi.y && k < cols; k++) {
                    mark(mapBoundRect.topLeft, coordinates[i], coordinates[i + 1], j, k, step, gridMap);
                }
            }
        } else if (gi.x >= gi1.x && gi.y <= gi1.y) {
            for (var j = gi1.x; j <= gi.x && j < rows; j++) {
                for (var k = gi.y; k <= gi1.y && k < cols; k++) {
                    // console.log("jj=" + j + ",k=" + k);
                    mark(mapBoundRect.topLeft, coordinates[i], coordinates[i + 1], j, k, step, gridMap);
                }
            }
        }
    }
    return gridMap;
}
// 示例用法
// const coordinates = [
//     { x: 1, y: 2 },
//     { x: 5, y: 6 },
//     { x: 3, y: 4 }
// ];
var boundingRectangle = {};

async function loadMap(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
                throw err;
            }
            // console.log(JSON.parse(data).data.building);
            const dataObject = JSON.parse(data.toString());
            var outline = dataObject.data.building.Outline;
            // console.log(dataObject.data.Floors)
            // console.log(dataObject.data.Floors[0].FuncAreas)
            for(let i = 0; i < dataObject.data.Floors[0].FuncAreas.length; i++) {
                // console.log(dataObject.data.Floors[0].FuncAreas[i]);
                let item = dataObject.data.Floors[0].FuncAreas[i].Outline[0][0];
                // console.log(item);
                for(let j = 0; j < item.length; j+=2) {
                    // console.log('j=' + (j + 1) % item.length)
                    outline.push(item[j]);
                    outline.push(item[j + 1]);
                    outline.push(item[(j + 2) % item.length]);
                    outline.push(item[(j + 2) % item.length + 1]);
                }
            };
            // console.log(outline);
            const coordinates = [];
            for (let i = 0; i < outline.length; i += 2) {
                coordinates.push({x: parseFloat(outline[i].toFixed(2)), y: parseFloat(outline[i + 1].toFixed(2))});
            }
            // console.log(typeof coordinates[0].x.toPrecision(2));
            boundingRectangle = findBoundingRectangle(coordinates);
            // console.log(boundingRectangle.topLeft.x);
            const gridMap = splitMapToGrid(coordinates, boundingRectangle);
            // console.log(gridMap);
            // for(let i = 0; i < gridMap.length; i++) {
            //     let s = "";
            //     for (let j = 0; j < gridMap[i].length; j++) {
            //         s += (gridMap[i][j] === 0? ' ': gridMap[i][j]);
            //         s += ",";
            //     }
            //     // s += "]";
            //     console.log(s);
            // }
            // console.log("finish");
            resolve(gridMap);
        });
    });
}

function loadBeacons(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
                throw err;
            }
            // console.log(JSON.parse(data).data.building);
            const dataObject = JSON.parse(data.toString());
            const beacons = [];
            dataObject.data.Floors[0].PubPoint.forEach(item => {
                // console.log(item);
                beacons.push(item.beacon);
            })
            resolve(beacons);
        });
    })
}

function point2Grid(x, y) {
    return gridIndex(boundingRectangle.topLeft, {x, y}, step);
}

function grid2point(x, y) {
    return {x: boundingRectangle.topLeft.x + x * step, y: boundingRectangle.topLeft.y + y * step};
}

module.exports = {
    loadMap,
    loadBeacons,
    point2Grid,
    grid2point
}
