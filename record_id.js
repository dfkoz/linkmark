// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var saved_count = 0;

// Receive messages from background.js, eg, user turned extension off.
chrome.extension.onMessage.addListener(
	function(msg) {
		
		switch (msg.action) {
			case 'record':
				recordClick(true); // show or hide annoying tweets before turning off/on		
				saved_count = saved_count + 1; // reset the blocked count.
				break;		
		}		
});


function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}


function recordClick() {
	  
	var ws = new cloudmine.WebService({
	  appid: '520a0e1b26044eb79b82d8f2bad2a080',
	  apikey: '1b873132a993449d89ef44dd64780638'
	});
	
	var public_profile = $(".public-profile").children("dd").children("span").html();
	var querystring_id = qs("id");
	var full_name = $(".full-name").html();
	var title = $("p.title").html();
	var url = document.URL;
	var datetime = new Date().getTime();
	
	var data = {
		'public_profile': public_profile,
		'querystring_id': querystring_id,
		'full_name': full_name,
		'public_profile': title,
		'url': url,
		'datetime': datetime,
		'test': true		
	};
	
	console.log(data);
	
	ws.update(datetime, data).on('success', function(data, response) {
		// Finally, send a message to update the badge.
		console.log(response);
		chrome.extension.sendMessage({action:'update_icon', ct: saved_count});
	});



	
	console.log("Finished. Supposedly.");

};
