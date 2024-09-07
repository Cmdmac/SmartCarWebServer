
var wsWebClients = [];
var wsMobileClients = [];
function sendMsgToWebClients(msg) {
	wsWebClients.forEach(client => client.send(JSON.stringify(msg)));
}

function sendMsgToMobileClients(msg) {
	wsMobileClients.forEach(client => client.send(JSON.stringify(msg)));
}

function addWebClient(ws) {
	if (ws.uuid) {
		console.log('ws exist!')
		return;
	}
	const timestamp = Date.now();
	ws.uuid = timestamp;
	wsWebClients.push(ws);
}

function removeWebClient(ws) {
	console.log("removeWebClient ws.uuid=" + ws.uuid);
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
	console.log("removeMobileClient ws.uuid=" + ws.uuid);
	for(let i = 0; i < wsMobileClients.length; i++) {
		if (wsMobileClients[i].uuid == ws.uuid) {
			wsMobileClients.splice(i, 1);
			return;
		}
	}
}

let wsStreamClients = [];
function addStreamWebClients(ws) {
	if (ws.uuid) {
		console.log('ws exist!')
		return;
	}
	const timestamp = Date.now();
	ws.uuid = timestamp;
	wsStreamClients.push(ws);
}

function removeStreamClient(ws) {
	console.log("removeStreamClient ws.uuid=" + ws.uuid);
	for(let i = 0; i < wsStreamClients.length; i++) {
		if (wsStreamClients[i].uuid == ws.uuid) {
			wsStreamClients.splice(i, 1);
			return;
		}
	}
}

function sendMsgToStreamWebClients(msg) {
	wsStreamClients.forEach(client => client.send(msg, {binary: true}));
}

module.exports = {
	sendMsgToWebClients,
	sendMsgToMobileClients,
	addWebClient,
	removeWebClient,
	addMobileClient,
	removeMobileClient,
	addStreamWebClients,
	removeStreamClient,
	sendMsgToStreamWebClients
}