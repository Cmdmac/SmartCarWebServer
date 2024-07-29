var express = require('express');
var router = express.Router();
var OpenAI = require('openai');
var config = require('../config');

const openai = new OpenAI({
    apiKey: config.llm.doubao.apiKey,
    baseURL: config.llm.doubao.baseUrl,
});

var wsLlm = null;

async function chatWithDoubao(msg, ws) {

    // Streaming:
    console.log('----- streaming request -----')
    const stream = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: config.llm.doubao.system },
            { role: 'user', content: msg },
        ],
        model: config.llm.doubao.model,
        stream: true,
    });
    for await (const part of stream) {
        //process.stdout.write(part.choices[0]?.delta?.content || '');
        let content = part.choices[0]?.delta?.content || '';
        // console.log(content);
        // res.send(content);
        ws.send(content);
    }
    //process.stdout.write('\n');
    // res.send('\n')
}

router.ws('/', (ws, req) => {
    // console.log(req.query);
    wsLlm = ws;
    ws.on('message', function (msg) {
        // console.log(msg);
        // console.log(msg.command);
        // ws.send(msg);
        chatWithDoubao(msg, ws);

    })

  
    ws.on('close', function (e) {
        wsLlm = null;
    })
});

module.exports = router;
