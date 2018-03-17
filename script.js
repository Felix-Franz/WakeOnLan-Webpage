var storage = {
	devices: {},
	login:{
	   user: undefined,
		password: undefined
    },
	afterLogin:{
		func: undefined,
		parameter: undefined
	},
	loginDialog: undefined
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
	    if (!storage.login.user && !storage.login.password) return;
        return "Basic " + btoa(storage.login.user + ":" + storage.login.password);
    }
	
	
}

function setUserCredentials(){
	storage.loginDialog.hide();
	storage.login.user = document.getElementById("user").value;
	storage.login.password = document.getElementById("password").value;
	storage.afterLogin.func.apply(this, storage.afterLogin.parameter);
	storage.afterLogin.func = undefined;
	storage.afterLogin.parameter = undefined;
}

function handleAuthorizationError(XMLHttpRequest, fnAfter, aAfter){
	if (XMLHttpRequest.status !== 401 && XMLHttpRequest.status !== 403) return true;
	storage.afterLogin.func = function(){
		setTimeout(function(){
			fnAfter.apply(this, arguments);
		}, 501);
	}
	storage.afterLogin.parameter = aAfter;
	if (XMLHttpRequest.status === 403) document.getElementById("login-wrong").style.display = null;
	else document.getElementById("login-wrong").style.display = 'none'
	storage.loginDialog.show();
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
		    if (handleAuthorizationError(XMLHttpRequest, onWakeUp, [iId])) Util.showToast(XMLHttpRequest.responseText);
		}
	});
}

function onBuildDeviceCard(oData){
	storage.devices = oData;
	var sContent = "";
	for (d in oData){
		var sCard = Util.buildCard(oData[d].name,
			"Description: " + oData[d].description + "<br />IP-Address: " + oData[d].ipAddress,
			"onWakeUp('" + oData[d].id + "');");
		sContent+= "\n" + sCard;
	}
	$("#devices").html(sContent);
}

function onLoad(){
	$.ajax({
		type: "GET",
		url: staticStorage.endpoint,
		headers: {
	       Authorization: Util.getAuthorizationHeader()
		},
		success: function (oData){
			onBuildDeviceCard(oData);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if (handleAuthorizationError(XMLHttpRequest, onLoad)) Util.showToast("Could not get devices!");
		}
	});
}

function onInit(){
	storage.loginDialog = new Dialog("loginDialog");
	onLoad();
}
