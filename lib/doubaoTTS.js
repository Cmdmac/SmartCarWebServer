
// const https = require('https');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const axios = require('axios');
const config  = require('../config.js');

const url = "https://openspeech.bytedance.com/api/v1/tts";

function doubaoTTS(text, dataCallback) {
	// 要发送的数据
	const postData = JSON.stringify({
		app: {
			appid: config.llm.doubao.appid,
			token: config.llm.doubao.token,
			cluster: config.llm.doubao.cluster,
		},
		user: {
			uid: config.llm.doubao.uid,
		},
		audio: {
			voice_type: config.llm.doubao.voice_type,
			encoding: "mp3",
			compression_rate: 1,
			rate: 24000,
			speed_ratio: 1.0,
			volume_ratio: 1.0,
			pitch_ratio: 1.0,
			emotion: config.llm.doubao.emotion,
			language: "cn"
		},
		request: {
			reqid: uuidv4(),
			text: text,
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
			Authorization : "Bearer;" + config.llm.doubao.token
		}
	};

	const req = axios.post(url, postData, options).then(res => {
		// console.log(res.data);
		let data = res.data;
		console.log(data.code);
		if (data.code === 3000) {
			console.log(data.message);
			const d = Buffer.from(data.data, 'base64');
			if (dataCallback) {
				dataCallback(d);
			}
			fs.writeFile("res.mp3", d, err => {
				if (err) {
					console.error(err);
				}
			})
		}

	}).catch(err => {
		console.log(err);
	});
}

module.exports = doubaoTTS;
