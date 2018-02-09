var storage = {
	devices: {},
	login:{
	   user: undefined,
        password: undefined
    }
};
var staticStorage = {
    endpoint: "./api/wol.php",
	card: '<div class="demo-card-square mdl-card mdl-shadow--2dp" style="width: 100%; margin: 1em;">'
		+ '\n' + '	<div class="mdl-card__title mdl-card--expand" style="align-self: center;">'
		+ '\n' + '		<h2 class="mdl-card__title-text">{{header}}</h2>'
		+ '\n' + '	</div>'
		+ '\n' + '	<div class="mdl-card__supporting-text">'
		+ '\n' + '		{{body}}'
		+ '\n' + '	</div>'
		+ '\n' + '	<div class="mdl-card__actions mdl-card--border">'
		+ '\n' + '		<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="{{onclick}}">'
		+ '\n' + '		Wake up!'
		+ '\n' + '		</a>'
		+ '\n' + '	</div>'
		+ '\n' + '</div>'
}

class Util{
	static showToast(sMessage){
		document.querySelector("#toast").MaterialSnackbar.showSnackbar({message: sMessage});
	}
	
	static buildCard(sHeader, sBody, sOnClick){
		var sCard = staticStorage.card;
		return sCard.replace(/{{header}}/, sHeader)
			.replace(/{{body}}/, sBody)
			.replace(/{{onclick}}/, sOnClick);
	}
	
	static getAuthorizationHeader(){
	    if (!storage.login.user || !storage.login.password) return;
        return "Basic " + btoa(storage.login.user + ":" + storage.login.password);
    }
	
	static handleAuthorizationError(XMLHttpRequest, fnAfter, aAfter){
	    if (XMLHttpRequest.status !== 401 && XMLHttpRequest.status !== 403) return true;
	    var bWrongCredentials = XMLHttpRequest.status === 403;
	    Util.showToast("Authorization required")
	    console.log(bWrongCredentials);
	    console.log(fnAfter);
	    console.log(aAfter);
	    //fnAfter.apply(this, aAfter);
    }
}

function onWakeUp(iId){
	$.ajax({
		type: "POST",
		url: staticStorage.endpoint,
		headers: {
	       Authorization: Util.getAuthorizationHeader()
		},
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({id: iId}),
		success: function (oData){
			Util.showToast(oData)
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
		    if (Util.handleAuthorizationError(XMLHttpRequest, onWakeUp, [iId])) Util.showToast(XMLHttpRequest.responseText);
		}
	});
}

function onBuildDeviceCard(oData){
	storage.devices = oData;
	var sContent = "";
	for (d in oData){
		var sCard = Util.buildCard(oData[d].name,
			"Hardware address: " + oData[d].hardwareAddress,
			"onWakeUp('" + oData[d].id + "');");
		sContent+= "\n" + sCard;
	}
	$("#devices").html(sContent);
}

function onLoad(){
	$.ajax({
		type: "GET",
		url: staticStorage.endpoint,
		success: function (oData){
			onBuildDeviceCard(oData);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			Util.showToast("Could not get devices!");
		}
	});
}

function onInit(){
	onLoad();
}
