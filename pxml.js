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
        // console.log(result.svg.g.g.path);

        let map = {Floors: [], building: {_id: 0, _xLon: 222, Tel: "23", Address: "dasf", Brief: "sdf", Area: 2342.23, FloorsId: "-1, 1,2,3,4,5", 
            Name_en: "", Version: 5, High: 1, FrontAngle: 0.232234, Mall: 1, Time: "", UnderFloors: 1, Type: 6, Adcode: 110105, DefaultFloor: 1, Remark: "sdfdf", _yLat: 22.234, Outline: [], Name: "sdfs", GroudFloors: 6}};
        let floor = {Brief: "sdsd", ImageLayer: {Area: 2234.02}, PubPoint: {}, FuncArea: {}, Name_en: "ssdf", Outline: [], _id: -1, High: 5, Name: "B1"};
        map.Floors[0] = floor;
        for (var i = 0; i < result.svg.g.g.path.length; i++) {
            var p = result.svg.g.g.path[i].$;
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
                let points = p.d.replaceAll('M', '').replaceAll('L', '').replaceAll('C', '').replaceAll('Z', '').replaceAll(/\s+/g,' ').trim().split(' ').map(item => parseFloat(item));
                let shop = {_id: Date.now(), Name: "block", name: "block", Name_en: "block", Area: 0, BrandShop: 70000, Brief: "", Category2: 102, ShoppNo: "", Brand: 1000, Type: 6001, Outline: points, dianping_id: 0};
                shop.Area = Math.abs(points[1] - points[3]) * Math.abs(points[0] - points[7]);
                console.log(points);
                console.log(Math.abs(points[0] - points[3]) * Math.abs(points[1] - points[7]));
                // console.log(shop);
                // calculate area
            } else if (p.fill == "none" && p['fill-opacity'] != 1) {
                // console.log(p)
                let points = p.d.replaceAll('M', '').replaceAll('L', '').replaceAll('C', '').replaceAll('Z', '').replaceAll(/\s+/g,' ').trim().split(' ');
                // console.log(points);
                points.forEach(item =>  floor.Outline.push(parseFloat(item)));
            }
        }
        map.building.Outline = floor.Outline;
        // console.log(map);
    });
});