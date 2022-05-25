var bildrScriptOpenPage = 'https://helloearth.bildr.com', bildrScriptBildrIfrmId = 'bildrifrm_My First Chrome Extension_1', bildrScriptBildrPopId = 'My First Chrome Extension_1'; 
function injectScript(file_path, tag) {
var node = document.getElementsByTagName(tag)[0];
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', file_path);
node.appendChild(script);
}
injectScript(chrome.runtime.getURL('js/injectScript_My First Chrome Extension_1.js'), 'body');
