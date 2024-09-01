
var wsWebClients = [];
var wsMobileClients = [];
function sendMsgToWebClients(msg) {
	wsWebClients.forEach(client => client.send(JSON.stringify(msg)));
}

function sendMsgToMobileClients(msg) {
	wsMobileClients.forEach(client => client.send(JSON.stringify(msg)));
}

function addWebClient(ws) {
	const timestamp = Date.now();
	if (ws.uuid) {
		console.log('ws exist!')
		return;
	}
	ws.uuid = timestamp;
	wsWebClients.push(ws);
}

function removeWebClient(ws) {
	console.log("removeWebClient ws.uuid" + ws.uuid);
	for(let i = 0; i < wsWebClients.length; i++) {
		if (wsWebClients[i].uuid == ws.uuid) {
			wsWebClients.splice(i, 1);
			return;
		}
	}
}

function addMobileClient(ws) {
	const timestamp = Date.now();
	if (ws.uuid) {
		console.log('ws exist!')
		return;
	}
	ws.uuid = timestamp;
	wsMobileClients.push(ws);
}

function removeMobileClient(ws) {
	console.log("removeMobileClient ws.uuid" + ws.uuid);
	for(let i = 0; i < wsMobileClients.length; i++) {
		if (wsMobileClients[i].uuid == ws.uuid) {
			wsMobileClients.splice(i, 1);
			return;
		}
	}
}

module.exports = {
	sendMsgToWebClients,
	sendMsgToMobileClients,
	addWebClient,
	removeWebClient,
	addMobileClient,
	removeMobileClient
}