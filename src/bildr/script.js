var openPage = 'https://helloearth.bildr.com/', bildrIfrmId = 'bildrifrm_My First Chrome Extension_1', bildrPopId = 'My First Chrome Extension_1'; 

//var openPage, bildrIfrmId, bildrPopId - vars from ext generating
// Append CSS File to head

var headID = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
headID.appendChild(link);
link.href = chrome.runtime.getURL('src/bildr/ui/css/bildrStyle.css');


var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}


//Open Bildr PopUp Page
var bildrPopUp = document.getElementById(bildrPopId);

if (!bildrPopUp) {
	/*
	$.get(chrome.extension.getURL('src/bildr/ui/bildrPopUp.html'), function (data) {
        console.log("*****	Appending bildrPopUp.html");
		$("body").append(data);
    });*/
	
	var client = new HttpClient();
	client.get(chrome.runtime.getURL('./src/bildr/ui/bildrPopUp.html'), function(response) {
	console.log("*****	Appending bildrPopUp.html");
		var elem = document.createElement('div');
		elem.innerHTML = response;
		document.body.appendChild(elem);
	});
} else {
	//bildr PopUp exist - toggle vissibe on-off
	if (bildrPopUp.style.display == "block") {
		//hide the panel
		bildrPopUp.style.display = "none";
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.width == "100%" || bildrPopUp.style.width == "100vw")) { document.body.style.paddingTop = "0px"; }				//Top Banner
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.height == "100%" || bildrPopUp.style.height == "100vh")) { document.body.style.paddingLeft = "0px"; }			//Left Banner
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.right == "0px"	&& (bildrPopUp.style.height == "100%" || bildrPopUp.style.height == "100vh")) { document.body.style.paddingRight = "0px"; }		//Right Banner
		if (bildrPopUp.style.bottom == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.width == "100%" || bildrPopUp.style.width == "100vw")) { document.body.style.paddingBottom = "0px"; }		//Bottom Banner
	} else {
		//show the panel
		bildrPopUp.style.display = "block";
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.width == "100%" || bildrPopUp.style.width == "100vw")) { document.body.style.paddingTop = bildrPopUp.style.height; }		//Top Banner
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.height == "100%" || bildrPopUp.style.height == "100vh")) { document.body.style.paddingLeft = bildrPopUp.style.width; } 		//Left Banner
		if (bildrPopUp.style.top == "0px" && bildrPopUp.style.right == "0px"	&& (bildrPopUp.style.height == "100%" || bildrPopUp.style.height == "100vh")) { document.body.style.paddingRight = bildrPopUp.style.width; }	//Right Banner
		if (bildrPopUp.style.bottom == "0px" && bildrPopUp.style.left == "0px"	&& (bildrPopUp.style.width == "100%" || bildrPopUp.style.width == "100vw")) { document.body.style.paddingBottom = bildrPopUp.style.height; }	//Top Banner
	}	
}


/********** listener to event from iframe *********/
var eventMethod = window.addEventListener ? "addEventListener":"attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"?"onmessage":"message";

eventer(messageEvent, function (e) {
	if (e && openPage && (openPage.indexOf(e.origin) != -1)) {
		console.log('Message from iframe just came! - To popUp Script !!!');
		var fnctActArgs = [];
		try {
			if (e.data.fnctArgs) fnctActArgs=JSON.parse(e.data.fnctArgs);
		} catch(e) {}
		
		//make sure fnctArgs = Array
		if (!(fnctActArgs && fnctActArgs.constructor && fnctActArgs.constructor === Array)) fnctActArgs = [fnctActArgs];
		if (fnctActArgs.onLoadAct && fnctActArgs.onLoadAct != "undefined" && fnctActArgs.onLoadAct*1 == 1) {
			fnctActArgs.onLoadAct = 1;
			fnctActArgs.uMsgId = e.data.uMsgId;
			fnctActArgs.bildrIfrmId = bildrIfrmId;
		}
		
		if (e.data.v3BildrExt) {
			var fnctName = e.data.fnctName;
			var response = window[fnctName](...fnctActArgs);			
		} else {
			/*
			var jsFunctionCode = e.data.jsCode;
			var F = new Function ('actionArguments',jsFunctionCode);
			var response = (F(fnctActArgs));
			*/
		}
		if (response && response != "undefined") {
			var myIframe = document.getElementById(bildrIfrmId).contentWindow;
			myIframe.postMessage( {"msgId":e.data.uMsgId,"result":response}, "*");
			}
	}	
});
/********** END - listener to event from iframe *********/