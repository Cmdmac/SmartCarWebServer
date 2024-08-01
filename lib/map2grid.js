const fs = require('fs');

function findBoundingRectangle(coordinates) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

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
    const iy = Math.abs(end.y - end.y) / step;
    return {x: ix, y: iy};
}

function createGridRectangle(topLeft, row, col, step) {
    const topLeftX = topLeft.x + row * step;
    const topLeftY = topLeft.y + col * step;
    const bottomRightX = topLeftX + step;
    const bottomRightY = topLeftY + step;
    return {topLeft: {topLeftX, topLeftY}, bottomRight: {bottomRightX, bottomRightY}};
}

function splitMapToGrid(coordinates, mapBoundRect) {
    const width = Math.abs(mapBoundRect.topLeft.x - mapBoundRect.bottomRight.x);
    const height = Math.abs(mapBoundRect.topLeft.y - mapBoundRect.bottomRight.y);
    console.log("width=" + width +",height=" + height);
    const step = 10;

    const rows = width / step;
    const cols = height / step;

    let gridMap = Array.from({ length: rows }, () => Array(cols).fill(0));

    // step by step check which grid
    for (let i = 0; i + 1< coordinates.length; i++) {
        const gi = gridIndex(coordinates[i], mapBoundRect.topLeft, step);
        // const startGrid = createGridRectangle(gi.x, gi.y, step);
        const gi1 = gridIndex(coordinates[i + 1], mapBoundRect.topLeft, step);
        // const endGrid = createGridRectangle(gi.x, gi.y, step);
        if (gi.x < gi1.x && gi.y < gi1.y) {
            for (let j = gi.x; j <= gi1.x; j++) {
                for (let k = gi.y;i <= gi1.y; k++) {
                    const grid = createGridRectangle(mapBoundRect.topLeft, j, k, step);
                    if (isLineIntersectRectangle(coordinates[i], coordinates[i + 1], grid.topLeft, grid.bottomRight)) {
                        gridMap[j][k] = 1;
                    }
                }
            }
        }
    }
}
// 示例用法
// const coordinates = [
//     { x: 1, y: 2 },
//     { x: 5, y: 6 },
//     { x: 3, y: 4 }
// ];



fs.readFile('indoorMap.json', (err, data) => {
    if (err) {
        throw err;
    }
    // console.log(JSON.parse(data).data.building);
    const outline = JSON.parse(data).data.building.Outline;
    //
    const coordinates = [];
    for (let i = 0; i < outline.length; i += 2) {
        coordinates.push({x: outline[i], y: outline[i + 1]});
    }
    const boundingRectangle = findBoundingRectangle(coordinates);
    console.log(boundingRectangle);
    splitMapToGrid(coordinates, boundingRectangle);
});