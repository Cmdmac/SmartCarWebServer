class ReferenceNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rssiAt1m = -55;
        this.pathLossExponent = 5;
    }

    calculateDistance(rssi) {
        return 10 ** ((this.rssiAt1m - rssi) / (10 * this.pathLossExponent));
    }
}

function trilateration(node1, node2, node3, rssi1, rssi2, rssi3) {
    const d1 = node1.calculateDistance(rssi1);
    const d2 = node2.calculateDistance(rssi2);
    const d3 = node3.calculateDistance(rssi3);

    const x1 = node1.x;
    const y1 = node1.y;
    const x2 = node2.x;
    const y2 = node2.y;
    const x3 = node3.x;
    const y3 = node3.y;

    // console.log('x1=' + x1 + ' x2=' + x2 + ' x3=' + x3);
    // console.log('y1=' + y1 + ' y2=' + y2 + ' y3=' + y3);
    const A = 2 * (x2 - x1);
    const B = 2 * (y2 - y1);
    const C = d1 ** 2 - d2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2;

    const D = 2 * (x3 - x1);
    const E = 2 * (y3 - y1);
    const F = d1 ** 2 - d3 ** 2 - x1 ** 2 + x3 ** 2 - y1 ** 2 + y3 ** 2;

    const x = ((C * E - F * B) / (A * E - D * B));
    const y = ((A * F - D * C) / (A * E - D * B));

    // console.log("A * E=)" + (A * E) + " D * B=" + (D * B));
    // console.log("d1=" + d1 +",d2=" + d2 +",d3=" + d3 + ",A=" + A + ",B=" + B + ",C=" + C + ",D=" + D + ",E=" + E + ",F=" + F + ",X=" + x + ",Y=" + y);
    return { x, y };
}


function localByRSSI(beacon1, beacon2, beacon3, rssi1, rssi2, rssi3) {
    try {
        const node1 = new ReferenceNode(beacon1.x, beacon1.y);
        const node2 = new ReferenceNode(beacon2.x, beacon2.y);
        const node3 = new ReferenceNode(beacon3.x, beacon3.y);

        const location = trilateration(node1, node2, node3, rssi1, rssi2, rssi3);

        console.log(location);
        // const location = trilateration(beacon1, beacon2, beacon3, distance1, distance2, distance3);
        console.log(`估计位置: x = ${location.x}, y = ${location.y}`);
        return location;
    } catch (error) {
        console.error(error.message);
    }
    return undefined;
}
module.exports = localByRSSI;