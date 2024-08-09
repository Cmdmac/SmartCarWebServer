const xml2js = require('xml2js');
const fs = require('fs');

fs.readFile('xhy.svg', (err, data) => {
    if (err) throw err;

    const parser = new xml2js.Parser({
        explicitArray: false,
        // ignoreAttrs: true
    });

    parser.parseString(data, (err, result) => {
        if (err) throw err;
        // var v = result.svg.g;
        // console.log(v[0].g[0].path);
        // console.log(result.svg.g.g.text);

        let blocks = ['冰箱', '电视柜', "沙发", "鞋柜-厅", "鞋柜", "烧水机", "床头柜", "床", "床头柜", "书柜", "鞋柜"]

        let map = {Floors: [], building: {_id: 0, _xLon: 222, Tel: "23", Address: "dasf", Brief: "sdf", Area: 2342.23, FloorsId: "-1, 1,2,3,4,5",
            Name_en: "", Version: 5, High: 1, FrontAngle: 0.232234, Mall: 1, Time: "", UnderFloors: 1, Type: 6, Adcode: 110105, DefaultFloor: 0, Remark: "sdfdf", _yLat: 22.234, Outline: [], Name: "sdfs", GroudFloors: 6}};
        let floor = {Brief: "sdsd", ImageLayer: {Area: 2234.02}, Stations: [], PubPoint: [], FuncAreas: [], Name_en: "ssdf", Outline: [[[]]], _id: 0, High: 5, Name: "B1"};
        map.Floors[0] = floor;
        for (var i = 0; i < result.svg.g.g.path.length; i++) {
            var p = result.svg.g.g.path[i].$;
            // console.log(p);
            if (p['fill-rule']) {
                // 矩形区域，获取4个坐标
                /*
                    {
                    "Brand": 25574,
                    "Type": "61100",
                    "Outline": [
                      [
                        [
                          -85,
                          -545,
                          -54,
                          -747,
                          -104,
                          -757,
                          -154,
                          -763,
                          -206,
                          -765,
                          -195,
                          -547,
                          -186,
                          -549,
                          -170,
                          -550,
                          -154,
                          -550,
                          -118,
                          -549,
                          -85,
                          -545
                        ]
                      ]
                    ],
                    "_id": 1070596097,
                    "ShopNo": "",
                    "Category2": 102,
                    "dianping_id": -1,
                    "Brief": "",
                    "Center": [
                      -137.36363636363637,
                      -624.2727272727273
                    ],
                    "Category": 102,
                    "name": "佳适优品生活馆",
                    "Name_en": "CASS",
                    "Area": 261.94140625,
                    "Name": "佳适优品生活馆",
                    "BrandShop": 75973
                  }
                */

                let points = p.d.replaceAll('M', '').replaceAll('L', '').replaceAll('Z', '').replaceAll(/\s+/g,' ').trim().split(' ').map(item => parseFloat(item));
                let shop = {_id: Date.now(), Name: "block", name: "block", Name_en: "block", Center: [], Area: 0, BrandShop: 70000, Brief: "", Category2: 102, ShoppNo: "", Brand: 1000, Type: 6001, Outline: [[points]], dianping_id: 0};
                let w = Math.abs(points[0] - points[4]);
                let h = Math.abs(points[1] - points[5]);
                shop.Center.push((points[0] + points[4]) / 2);
                shop.Center.push((points[1] + points[5]) / 2);
                shop.Area = w * h;
                    // shop.Area = Math.abs(points[1] - points[3]) * Math.abs(points[0] - points[7]);
                    // console.log(points);
                    // console.log(Math.abs(points[0] - points[3]) * Math.abs(points[1] - points[7]));
                    // console.log(shop.Center);
                    // calculate area
                shop.Name = blocks[floor.FuncAreas.length];
                floor.FuncAreas.push(shop);

            } else if (p.fill === "none" && p['fill-opacity'] != 1 && p.stroke == "rgb(0,0,0)" && p['stroke-opacity'] != 1) {
                // console.log(p)
                if (p.d.includes('C')) {
                    // console.log(p);
                    let points = p.d.replaceAll('M', '').replaceAll('C', '').replaceAll('Z', '').replaceAll(/\s+/g,' ').trim().split(' ');
                    // console.log(points);
                    points.forEach(item =>  floor.Outline[0][0].push(parseFloat(item)));
                } else {
                    let points = p.d.replaceAll('M', '').replaceAll('L', '').replaceAll('C', '').replaceAll('Z', '').replaceAll(/\s+/g,' ').trim().split(' ');
                    // console.log(points);
                    points.forEach(item =>  floor.Outline[0][0].push(parseFloat(item)));
                }

            }
        }
        result.svg.g.g.text.forEach(text => {
           let item = text.$;
           if (item.fill === 'none') {
               // console.log(text);
               // {
               //     "Brief": "",
               //     "Name_en": "Cashier",
               //     "Outline": [
               //     [
               //         [
               //             -300,
               //             5
               //         ]
               //     ]
               // ],
               //     "_id": 1071644732,
               //     "Type": "11003",
               //     "Name": "收银台"
               // },
               floor.PubPoint.push({Brief: "", Name: text._, Name_en: text._, _id: Date.now(), Type: 30000, Outline: [[[parseInt(item.x), parseInt(item.y)]]]});
           }
        });
            // add ble station
        map.building.Outline = floor.Outline[0][0];
        let data = {data: map};
        // console.log(map);
        console.log(floor.Outline[0][0].length)
        let c = JSON.stringify(data);

        fs.writeFile('indoorMap.json', c, err => {
            if (err) {
                console.error(err);
            }
        })
    });
});