
// const https = require('https');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const axios = require('axios');
const WebSocket = require('ws');
const config  = require('../config.js');

const tag = "doubaoTTS";

function createData(text, isHttp) {
	console.log(text);
	// 要发送的数据
	const postData = JSON.stringify({
		app: {
			appid: config.tts.doubao.appid,
			token: config.tts.doubao.token,
			cluster: config.tts.doubao.cluster,
		},
		user: {
			uid: config.tts.doubao.uid,
		},
		audio: {
			voice_type: config.tts.doubao.voice_type,
			encoding: "mp3",
			compression_rate: 1,
			rate: 24000,
			speed_ratio: 1.0,
			volume_ratio: 1.0,
			pitch_ratio: 1.0,
			emotion: config.tts.doubao.emotion,
			language: "cn"
		},
		request: {
			reqid: uuidv4(),
			text: text,
			text_type: "plain",
			operation: isHttp ? "query" : "submit",
			silence_duration: 125,
			with_frontend: 1,
			frontend_type: "unitTson",
			pure_english_opt: 1
		}
	});
	return postData;
}

function getByHttp(text) {

	const postData = createData(text, true);

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

	return new Promise((resolve, reject) => {
		let timeStart = Date.now();
		const url = "https://openspeech.bytedance.com/api/v1/tts";

		const req = axios.post(url, postData, options).then(res => {
			// console.log(res.data);
			let data = res.data;
			console.log(tag + "post code=" + data.code);
			let timeEnd = Date.now();
			console.log(tag + "time cost=" + (timeEnd - timeStart));

			if (data.code === 3000) {
				console.log(tag + "post message=" + data.message);
				const d = Buffer.from(data.data, 'base64');
				if (resolve) {
					resolve(d);
				}
			}

		}).catch(err => {
			console.log(err);
			if (reject) {
				reject(err);
			}
		});
	});
}

const url = "wss://openspeech.bytedance.com/api/v1/tts/ws_binary";
const ws = new WebSocket(url);

function getByWs(text) {
	return new Promise((resolve, reject) => {
		const postData = createData(text, false);
		const headerBytes = Buffer.from([0x11, 0x10, 0x10, 0x00]);
		ws.on('open', () => {
			console.log('WebSocket 连接已打开');
			// 在此处发送数据
			//ws.send('Hello, Server!');
			const dataBytes = Buffer.from(JSON.stringify(postData));

			const length = Buffer.alloc(4).writeInt32BE(dataBytes.length, 0);
			console.log(length);

			const sendBytes = Buffer.concat([headerBytes, Buffer.of(length), dataBytes]);
			ws.send(sendBytes);
		});

		ws.on('message', (message) => {
			console.log(`接收到消息: ${message}`);
			resolve(message);
		});

		ws.on('close', () => {
			console.log('WebSocket 连接已关闭');
		});

		ws.on('error', (error) => {
			console.error(`发生错误: ${error}`);
		});
	});

}

module.exports = {
	getByHttp,
	getByWs
};
