// 定义信标坐标
const beacon1 = { x: 0, y: 0 };
const beacon2 = { x: 100, y: 0 };
const beacon3 = { x: 50, y: 86.6 };

// 定义传播模型参数
const n = 2;
const referenceDistance = 1;
const referenceRSSI = -55;

// 计算距离的函数
function calculateDistance(rssi) {
    return Math.pow(10, ((referenceRSSI - rssi) / (10 * n)));
}

// 计算三边测量的函数
function trilateration(beacon1, beacon2, beacon3, distance1, distance2, distance3) {
    const A = 2 * (beacon2.x - beacon1.x);
    const B = 2 * (beacon2.y - beacon1.y);
    const C = Math.pow(distance1, 2) - Math.pow(distance2, 2) - Math.pow(beacon1.x, 2) + Math.pow(beacon2.x, 2) - Math.pow(beacon1.y, 2) + Math.pow(beacon2.y, 2);

    const D = 2 * (beacon3.x - beacon1.x);
    const E = 2 * (beacon3.y - beacon1.y);
    const F = Math.pow(distance1, 2) - Math.pow(distance3, 2) - Math.pow(beacon1.x, 2) + Math.pow(beacon3.x, 2) - Math.pow(beacon1.y, 2) + Math.pow(beacon3.y, 2);

    // 处理可能的除数为零的情况
    if ((B * D - A * E) === 0) {
        throw new Error('无法进行三边测量计算，可能存在共线的信标或测量误差过大。');
    }

    const x = (C * E - F * B) / (E * A - B * D);
    const y = (C * D - A * F) / (B * D - A * E);

    return { x, y };
}

// 模拟多次测量 RSSI 的函数
function simulateMultipleMeasurements(rssi1, rssi2, rssi3) {
    const measurements1 = [];
    const measurements2 = [];
    const measurements3 = [];

    for (let i = 0; i < 10; i++) {
        measurements1.push(rssi1 + Math.random() * 5 - 2.5);  // 加入随机噪声
        measurements2.push(rssi2 + Math.random() * 5 - 2.5);
        measurements3.push(rssi3 + Math.random() * 5 - 2.5);
    }

    // 去除异常值
    const sortedMeasurements1 = measurements1.sort((a, b) => a - b);
    const sortedMeasurements2 = measurements2.sort((a, b) => a - b);
    const sortedMeasurements3 = measurements3.sort((a, b) => a - b);

    const trimmedMeasurements1 = sortedMeasurements1.slice(2, 8);
    const trimmedMeasurements2 = sortedMeasurements2.slice(2, 8);
    const trimmedMeasurements3 = sortedMeasurements3.slice(2, 8);

    // 计算平均值
    const averageRSSI1 = trimmedMeasurements1.reduce((a, b) => a + b, 0) / trimmedMeasurements1.length;
    const averageRSSI2 = trimmedMeasurements2.reduce((a, b) => a + b, 0) / trimmedMeasurements2.length;
    const averageRSSI3 = trimmedMeasurements3.reduce((a, b) => a + b, 0) / trimmedMeasurements3.length;

    return { averageRSSI1, averageRSSI2, averageRSSI3 };
}


function localByRSSI(rssi1, rssi2, rssi3) {
    try {
        const { averageRSSI1, averageRSSI2, averageRSSI3 } = simulateMultipleMeasurements(rssi1, rssi2, rssi3);

        const distance1 = calculateDistance(averageRSSI1);
        const distance2 = calculateDistance(averageRSSI2);
        const distance3 = calculateDistance(averageRSSI3);

        const location = trilateration(beacon1, beacon2, beacon3, distance1, distance2, distance3);
        console.log(`估计位置: x = ${location.x}, y = ${location.y}`);
        return location;
    } catch (error) {
        console.error(error.message);
    }
    return null;
}
module.exports = localByRSSI;