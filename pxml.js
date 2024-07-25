const xml2js = require('xml2js');
const fs = require('fs');

fs.readFile('xhy.xml', (err, data) => {
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
        for (var i = 0; i < result.svg.g.g.path.length; i++) {
            var p = result.svg.g.g.path[i].$;
            if (p['fill-rule']) {
                // 矩形区域
                console.log(p);
            }
        }


    });
});