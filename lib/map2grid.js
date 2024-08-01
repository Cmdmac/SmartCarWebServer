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
    if (isLineIntersectLine({ x: rectLeft, y: rectTop }, { x: rectRight, y: rectTop }, lineStart, lineEnd) ||
        isLineIntersectLine({ x: rectRight, y: rectTop }, { x: rectRight, y: rectBottom }, lineStart, lineEnd) ||
        isLineIntersectLine({ x: rectRight, y: rectBottom }, { x: rectLeft, y: rectBottom }, lineStart, lineEnd) ||
        isLineIntersectLine({ x: rectLeft, y: rectBottom }, { x: rectLeft, y: rectTop }, lineStart, lineEnd)) {
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

function isLineIntersectLine(line1Start, line1End, line2Start, line2End) {
    const denominator = (line1End.y - line1Start.y) * (line2End.x - line2Start.x) - (line1End.x - line1Start.x) * (line2End.y - line2Start.y);

    if (denominator === 0) {
        return false;
    }

    const ua = ((line2End.x - line2Start.x) * (line1Start.y - line2Start.y) - (line2End.y - line2Start.y) * (line1Start.x - line2Start.x)) / denominator;
    const ub = ((line1End.x - line1Start.x) * (line1Start.y - line2Start.y) - (line1End.y - line1Start.y) * (line1Start.x - line2Start.x)) / denominator;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return true;
    }

    return false;
}

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

function splitMapToGrid(coordinates, mapBoundRect) {
    const width = parseInt(Math.abs(mapBoundRect.topLeft.x - mapBoundRect.bottomRight.x));
    const height = parseInt(Math.abs(mapBoundRect.topLeft.y - mapBoundRect.bottomRight.y));
    console.log("width=" + width +",height=" + height);
    const step = 10;

    const rows = parseInt(width / step);
    const cols = parseInt(height / step);

    console.log(mapBoundRect);
    console.log("rows=" + rows + ",cols=" + cols);
    // console.log(cols);

    const gridMap = Array.from({ length: rows }, () => Array(cols).fill(0));

    // step by step check which grid
    for (var i = 0; i + 1 < coordinates.length; i++) {
        // console.log("i=" + i + "," + JSON.stringify(coordinates[i]) + JSON.stringify(coordinates[i + 1]));
        const gi = gridIndex(coordinates[i], mapBoundRect.topLeft, step);
        // const startGrid = createGridRectangle(gi.x, gi.y, step);
        const gi1 = gridIndex(coordinates[i + 1], mapBoundRect.topLeft, step);
        // const endGrid = createGridRectangle(gi.x, gi.y, step);

        // console.log("ii=" + i + "," + JSON.stringify(gi) + JSON.stringify(gi1));
        if (gi.x <= gi1.x && gi.y <= gi1.y) {
            for (var j = gi.x; j < gi1.x; j++) {
                for (var k = gi.y; k < gi1.y; k++) {
                    const grid = createGridRectangle(mapBoundRect.topLeft, j, k, step);
                    // console.log(JSON.stringify(mapBoundRect.topLeft) + ",j=" + j + ",k=" + k + ",step=" + step + ",grid=" + JSON.stringify(grid));
                    if (isLineIntersectRectangle(coordinates[i], coordinates[i + 1], grid.topLeft, grid.bottomRight)) {
                        console.log("j=" + j + ",k=" + k);
                        gridMap[j][k] = 1;
                    }
                }
            }
        } else if (gi.x <= gi1.x && gi.y >= gi1.y) {
            for (var j = gi.x; j < gi1.x; j++) {
                for (var k = gi1.y; k < gi.y; k++) {
                    const grid = createGridRectangle(mapBoundRect.topLeft, j, k, step);
                    if (isLineIntersectRectangle(coordinates[i], coordinates[i + 1], grid.topLeft, grid.bottomRight)) {
                        console.log("j=" + j + ",k=" + k);
                        gridMap[j][k] = 1;
                    }
                }
            }
        } else if (gi.x >= gi1.x && gi.y >= gi1.y) {
            for (var j = gi1.x; j < gi.x; j++) {
                for (var k = gi1.y; k < gi.y; k++) {
                    const grid = createGridRectangle(mapBoundRect.topLeft, j, k, step);
                    if (isLineIntersectRectangle(coordinates[i], coordinates[i + 1], grid.topLeft, grid.bottomRight)) {
                        console.log("j=" + j + ",k=" + k);
                        gridMap[j][k] = 1;
                    }
                }
            }
        } else if (gi.x >= gi1.x && gi.y <= gi1.y) {
            for (var j = gi1.x; j < gi.x; j++) {
                for (var k = gi.y; k < gi1.y; k++) {
                    const grid = createGridRectangle(mapBoundRect.topLeft, j, k, step);
                    if (isLineIntersectRectangle(coordinates[i], coordinates[i + 1], grid.topLeft, grid.bottomRight)) {
                        console.log("j=" + j + ",k=" + k);
                        gridMap[j][k] = 1;
                    }
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



fs.readFile('./indoorMap.json', (err, data) => {
    if (err) {
        throw err;
    }
    // console.log(JSON.parse(data).data.building);
    const outline = JSON.parse(data).data.building.Outline;
    //
    const coordinates = [];
    for (let i = 0; i < outline.length; i += 2) {
        coordinates.push({x: parseFloat(outline[i].toFixed(2)), y: parseFloat(outline[i + 1].toFixed(2))});
    }
    // console.log(typeof coordinates[0].x.toPrecision(2));
    const boundingRectangle = findBoundingRectangle(coordinates);
    // console.log(boundingRectangle.topLeft.x);
    const gridMap = splitMapToGrid(coordinates, boundingRectangle);
    console.log(gridMap);
});