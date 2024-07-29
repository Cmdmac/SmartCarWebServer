var express = require('express');
var router = express.Router();
var OpenAI = require('openai');
var config = require('config');

const openai = new OpenAI({
    apiKey: config.llm.doubao.apiKey,
    baseURL: config.llm.doubao.baseUrl,
});

async function chat(req, res) {

    // Streaming:
    console.log('----- streaming request -----')
    const stream = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: config.llm.doubao.system },
            { role: 'user', content: config.llm.doubao.user },
        ],
        model: config.llm.doubao.model,
        stream: true,
    });
    for await (const part of stream) {
        //process.stdout.write(part.choices[0]?.delta?.content || '');
        res.send(part.choices[0]?.delta?.content || '');
    }
    //process.stdout.write('\n');
    res.send('\n')
}

/* GET home page. */
router.get('/', function(req, res, next) {
    chat(req, res);
});

module.exports = router;
