const express = require('express')
const route = express.Router() // 实例化路由对象

// const getNowTime = require('./utils/index')


var wsWeb = null;
var wsMobile = null;

const httpwsbridge = require('../lib/httpwsbridge');
//connect with browser
route.ws('/web', (ws, req) => {

  // console.log("ws from web req=" + JSON.stringify(req));
  wsWeb = ws;
  httpwsbridge.updateWebClient(ws);
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
  httpwsbridge.updateMobileClient(ws);
  console.log('mobile connected')
  wsMobile.send("hello esp32")
  ws.on('message', function (msg) {
    console.log(msg);
    
  })

  
  ws.on('close', function (e) {
      wsMobile = null;
  })
})

module.exports = route 