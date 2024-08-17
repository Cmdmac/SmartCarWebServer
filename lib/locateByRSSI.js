
rssiAt1m = -55;
pathLossExponent = 5;

function calculateDistance(rssi) {
    return 10 ** ((rssiAt1m - rssi) / (10 * pathLossExponent));
}


function trilateration(node1, node2, node3, rssi1, rssi2, rssi3) {
    const d1 = calculateDistance(rssi1);
    const d2 = calculateDistance(rssi2);
    const d3 = calculateDistance(rssi3);

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


// 三点定位函数，分别传入 参考点a、b、c的x、y坐标、待测点与参考点a的距离
function threePointLocation(ax, ay, ad, bx, by, bd, cx, cy, cd)
{
    /*
        说明：参考的三点坐标及距离位置点的距离。
        不适用情况：三个参考点连成的三角形其两边（直角三角形的直角边）不能平行于xy坐标轴，例如p1(0,0),p2(3,0),p3(0,4),交点(3,4)
        测试数据：p1(0,0),p2(3,4),p3(6,0),交点(6,8)
    */
    //var ref_x = [0, 3, 6];
    //var ref_y = [0, 4, 0];
    //var ref_d = [4, 3, 4];
    var ref_x = [];
    var ref_y = [];
    var ref_d = [];
    // 计算出的三组 (d[i]方-d[j]方-x[i]方+y[j]方+x[j]方-y[i]方)/(2*(x[j]-x[i]))
    var dxyx = [];
    // 计算出的三组 (d[i]方-d[j]方-x[i]方+y[j]方+x[j]方-y[i]方)/(2*(y[j]-y[i]))
    var dxyy = [];
    // 计算出的三组 (x[i]-x[j])/(y[i]-y[j])
    var x_divide_y = [];
    // 计算出的三组 (y[i]-y[j])/(x[i]-x[j])
    var y_divide_x = [];
    // 计算出的三组x y坐标
    var temp_x = [], temp_y = [];
    // 平均x y坐标
    var x = 0, y = 0;
    var i = 0, j = 0, k = 0;
    // 存储交点p坐标
    var p = JSON.parse("{\"x\": 0, \"y\": 0}");
    
    // 初始化数据
    ref_x.push(ax, bx, cx);
    ref_y.push(ay, by, cy);
    ref_d.push(ad, bd, cd);

    for(i = 0; i < 3; i++)
    {
        //console.log("p[" + i +"](" + ref_x[i] + ", " + ref_y[i] + "), dis=" + ref_d[i] + "\n");

        j = (i + 1) > 2 ? 2 : (i + 1);
        k = k > 1 ? 0 : k;
        
        //console.log("numerator:" + (ref_d[k] * ref_d[k] - ref_d[j] * ref_d[j] - ref_x[k] * ref_x[k] + ref_y[j] * ref_y[j] + ref_x[j] * ref_x[j] - ref_y[k] * ref_y[k]));


        if(ref_x[j] - ref_x[k] != 0) 
            dxyx[i] = (ref_d[k] * ref_d[k] - ref_d[j] * ref_d[j] - ref_x[k] * ref_x[k] + ref_y[j] * ref_y[j] + ref_x[j] * ref_x[j] - ref_y[k] * ref_y[k]) / 2 /(ref_x[j] - ref_x[k]);
        else
            dxyx[i] = 0;

        if(ref_y[j] - ref_y[k] != 0) 
            dxyy[i] = (ref_d[k] * ref_d[k] - ref_d[j] * ref_d[j] - ref_x[k] * ref_x[k] + ref_y[j] * ref_y[j] + ref_x[j] * ref_x[j] - ref_y[k] * ref_y[k]) / 2 /(ref_y[j] - ref_y[k]);
        else
            dxyy[i] = 0;

        if(ref_y[j] - ref_y[k] != 0)
            x_divide_y[i] = (ref_x[j] - ref_x[k]) / (ref_y[j] - ref_y[k]);
        else
            x_divide_y[i] = 0;

        if(ref_x[j] - ref_x[k] != 0)
            y_divide_x[i] = (ref_y[j] - ref_y[k]) / (ref_x[j] - ref_x[k]);
        else
            y_divide_x[i] = 0;
            
        //console.log("dxyx[" + i + "]:" + dxyx[i] + ", dxyy[" + i + "]:" + dxyy[i]);
        //console.log("x_divide_y[" + i + "]:" + x_divide_y[i] + ", y_divide_x[" + i + "]:" + y_divide_x[i]);

        k++;
    }

    j = 0;
    k = 0;
    for(i = 0; i < 3; i++)
    {
        j = (i + 1) > 2 ? 2 : (i + 1);
        k = k > 1 ? 0 : k;
        if(x_divide_y[k] - x_divide_y[j] != 0)
        {
            temp_x[i] = (dxyy[k] - dxyy[j]) / (x_divide_y[k] - x_divide_y[j]);
            temp_y[i] = (dxyx[k] - dxyx[j]) / (y_divide_x[k] - y_divide_x[j]);
        }
        else
        {
            temp_x[i] = 0;
            temp_y[i] = 0;
        }
    }

    x = (temp_x[0] + temp_x[1] + temp_x[2]) / 3;
    y = (temp_y[0] + temp_y[1] + temp_y[2]) / 3;

    // console.log("\n[ x:" + x + ", y:" + y + " ]\n"); 
    
    p.x = x;
    p.y = y;
    
    return p;
}

function localByRSSI(beacon1, beacon2, beacon3, rssi1, rssi2, rssi3) {
    try {
        
        const d1 = calculateDistance(rssi1);
        const d2 = calculateDistance(rssi2);
        const d3 = calculateDistance(rssi3);
        const location = threePointLocation(beacon1.x, beacon1.y, d1, beacon2.x, beacon2.y, d2, beacon3.x, beacon3.y, d3);
        // const location = trilateration(beacon1, beacon2, beacon3, rssi1, rssi2, rssi3);

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