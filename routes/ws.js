const express = require('express')
const route = express.Router() // 实例化路由对象

// const getNowTime = require('./utils/index')


var wsWeb = null;
var wsMobile = null;

//connect with browser
route.ws('/web', (ws, req) => {

  // console.log("ws from web req=" + JSON.stringify(req));
  wsWeb = ws;

  ws.on('message', function (msg) {
    console.log(msg);
    // console.log(msg.command);
    // ws.send(msg);
    var obj = JSON.parse(msg);
    console.log(obj.command);

    if (obj) {
      // console.log('parse and send')
      if (wsMobile) {
        wsMobile.send(obj);
        console.log('trasfer msg to mobile msg=' + msg);
      }
    }
  })

  
  ws.on('close', function (e) {
      wsWeb = null;
  })
})


// connect with esp32
route.ws('/mobile', (ws, req) => {
  wsMobile = ws;

})

module.exports = route 