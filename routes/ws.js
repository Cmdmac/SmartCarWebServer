const express = require('express')
const route = express.Router() // 实例化路由对象

// const getNowTime = require('./utils/index')

const httpwsbridge = require('../lib/httpwsbridge');
//connect with browser
route.ws('/web', (ws, req) => {
  console.log(req.url);
  // console.log("ws from web req=" + JSON.stringify(req));
  httpwsbridge.addWebClient(ws);
  ws.on('message', function (msg) {
    console.log(msg);
    // console.log(msg.command);
    // ws.send(msg);
    var obj = JSON.parse(msg);
    // console.log(obj);
    console.log(obj.command);

    if (obj) {
      // console.log('parse and send')
      httpwsbridge.sendMsgToMobileClients(msg);
      console.log('trasfer msg to mobile msg=' + msg);
    }
  })

  
  ws.on('close', function (e) {
      httpwsbridge.removeWebClient(ws);
  })
})


// connect with esp32
route.ws('/mobile/hub', (ws, req) => {
  console.log(req.url);
  httpwsbridge.addMobileClient(ws);
  ws.on('message', function (msg) {
    console.log(msg);
    
  })

  
  ws.on('close', function (e) {
      httpwsbridge.removeMobileClient(ws);
  })
})


// connect with camera
route.ws('/mobile/camera/control',  (ws, req) => {
  console.log(req.url);
  httpwsbridge.addMobileClient(ws);
  ws.on('message', function (msg) {
    console.log(msg);
    
  })

  
  ws.on('close', function (e) {
      httpwsbridge.removeMobileClient(ws);
  })
})

// connect with camera
route.ws('/mobile/camera/stream',  (ws, req) => {
  console.log(req.url);
  // httpwsbridge.addMobileClient(ws);
  ws.on('message', function (msg) {
    console.log(msg.length);
    
  })

  
  ws.on('close', function (e) {
      // httpwsbridge.removeMobileClient(ws);
  })
})
module.exports = route 