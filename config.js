
let config = {
    llm: {
        doubao: {
            apiKey: "",
            baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
            model: "ep-20240729170237-65w4v",
            system: "你是一个精通与儿童沟通交流的小伙伴，你能识别儿童的情感也能解决儿童遇到的很多好奇的问题",
            user: ""
        }
    },
    tts: {
        doubao: {
            appid: -1,
            token: "",
            cluster: "",
            uid: -1,
            voice_type: "",
            emotion: "",
        }
    }
}

module.exports = config;
