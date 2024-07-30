
// const https = require('https');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const axios = require('axios');


var url = "https://openspeech.bytedance.com/api/v1/tts";

// 要发送的数据
const postData = JSON.stringify({
  app: {
  	appid: 4778258397,
  	token: "fg4p6rRXA3LOyR6H1yRgaqyNlrdUJiZB",
  	cluster: "volcano_tts",
  },
  user: {
  	uid: 2101631197
  },
  audio: {
  	voice_type: "BV700_streaming",
  	encoding: "mp3",
  	compression_rate: 1,
  	rate: 24000,
  	speed_ratio: 1.0,
  	volume_ratio: 1.0,
  	pictch_ratio: 1.0,
  	emotion: "happy",
  	language: "cn"
  },
  request: {
  	reqid: uuidv4(),
  	text: "你好，我是你的小助理，请叫我皮皮",
  	text_type: "plain",
  	operation: "query",
  	silence_duration: 125,
  	with_frontend: 1,
  	frontend_type: "unitTson",
  	pure_english_opt: 1
  }
});


const options = {
  // hostname: 'openspeech.bytedance.com',
  // port: 443,
  // path: '/api/v1/tts',
  // method: 'POST',
	headers: {
    // 'Content-Type': 'application/json',
    // 'Custom-Header': 'Authorization : "Bearer;fg4p6rRXA3LOyR6H1yRgaqyNlrdUJiZB"', // 添加自定义请求头
    // 'Another-Header': 'another value' // 可以添加多个自定义请求头
    Authorization : "Bearer;fg4p6rRXA3LOyR6H1yRgaqyNlrdUJiZB"
  }
};

const req = axios.post(url, postData, options).then(res => {
	// console.log(res.data);
	let data = res.data;
  	console.log(data.code);
	if (data.code == 3000) {
	   	console.log(data.message);
	    const d = Buffer.from(data.data, 'base64');
	    fs.writeFile("res.mp3", d, err => {
	        if (err) {
	            console.error(err);
	        }
	    })
	}

}).catch(err => {
	console.log(err);
});
