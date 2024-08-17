
var wsWebClient = undefined;
var wsMobileClient = undefined;
function sendMsgToWeb(msg) {
	if (wsWebClient != undefined) {
		wsWebClient.send(JSON.stringify(msg));
	}
}

function sendMsgToMobile(msg) {
	if (wsMobileClient != undefined) {
		wsMobileClient.send(JSON.stringify(msg));
	}
}

function updateWebClient(ws) {
	wsWebClient = ws;
}

function updateMobileClient(ws) {
	wsMobileClient = ws;
}

module.exports = {
	sendMsgToWeb,
	sendMsgToMobile,
	updateWebClient,
	updateMobileClient
}