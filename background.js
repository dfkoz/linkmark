chrome.browserAction.setBadgeBackgroundColor({color: [0, 50, 200, 150]});
chrome.browserAction.setBadgeText({text: "ON"});

// Process events from tabs.
chrome.extension.onMessage.addListener(
 	function(msg, sender, sendResponse) {
  		switch(msg.action) {
  			case 'update_icon':
				if (msg.ct > 0 ) {
					chrome.browserAction.setBadgeText({text: msg.ct.toString()});
					chrome.browserAction.setBadgeBackgroundColor({color: [0, 50, 200, 150]});	   	
   				} else {
   					chrome.browserAction.setBadgeBackgroundColor({color: [0, 50, 200, 150]});
					chrome.browserAction.setBadgeText({text: "ON"});
   				}
   				
   				break;			
  		}
	}  		 		
);

// User clicked on icon, which should toggle active status
chrome.browserAction.onClicked.addListener(function(activeTab) { 
	// Ask the tab (via script.js) to log the LinkedIn contact.

	chrome.tabs.sendMessage(activeTab.id, {action: "record"});
	
});
