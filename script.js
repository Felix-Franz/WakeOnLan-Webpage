var storage = {
	devices: {},
	card: '<div class="demo-card-square mdl-card mdl-shadow--2dp" style="width: 100%;">'
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
};

class Util{
	static showToast(sMessage){
		document.querySelector("#toast").MaterialSnackbar.showSnackbar({message: sMessage});
	}
	
	static buildCard(sHeader, sBody, sOnClick){
		var sCard = storage.card;
		return sCard.replace(/{{header}}/, sHeader)
			.replace(/{{body}}/, sBody)
			.replace(/{{onclick}}/, sOnClick);
	}
}

function onWakeUp(sHardwareAddress){
	
}

function onBuildDeviceCard(oData){
	storage.devices = oData;
	var sContent = "";
	for (d in oData){
		var sCard = Util.buildCard(oData[d].name,
			"Hardware address: " + oData[d].hardwareAddress,
			"onWakeUp('" + oData[d].hardwareAddress + "');");
		sContent+= "\n" + sCard;
	}
	$("#devices").html(sContent);
}

function onLoad(){
	$.ajax({
		type: "GET",
		url: "./api/wol.php",
		success: function (oData){
			console.log(oData);
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
