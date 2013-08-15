// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var saved_count = 0;
var data;

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

updateCount();

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

	var data = getData();
	
	if (!data['public_profile'] || data['public_profile.length'] < 5) {
		alert("Either you are not on a profile page, or something is FUBAR. Please contact Dan.");
		return null;
	}
	
	// Does the key exist?
	ws.search('[public_profile = "' + data['public_profile'] + '"]')
	.on('success', function(data, response) {
		
		var rec = getData();
		
		// If any keys in the message, we have data.
		var success = false;
		for (var k in data) { success = true; }
		
		if (success) {
			alert("Contact exists already, but thanks for the enthusiasm!");			
		} else {
			ws.update(rec['public_profile'], rec).on('success', function(data, response) {
				// Finally, send a message to update the badge.
				updateCount();
				console.log("Success");
			}).on("error", function(data, apicall) {
				console.log("Failure: " + apicall.status)
			}).on("complete", function(data, apicall) {
				updateCount();
				console.log("Complete");
			});
			
			console.log("Upload sent.");
		}
	});
};

function getData() {
	var public_profile = $(".public-profile").children("dd").children("span").html();
	var querystring_id = qs("id");
	var full_name = $(".full-name").html();
	var title = $("p.title").html();
	var url = document.URL;
	var datetime = new Date().getTime();
		
	data = {
		'public_profile': public_profile,
		'querystring_id': querystring_id,
		'full_name': full_name,
		'title': title,
		'url': url,
		'datetime': datetime,
		'test': true		
	};
	
	return data;
}

function updateCount() {
	var ws = new cloudmine.WebService({
	  appid: '520a0e1b26044eb79b82d8f2bad2a080',
	  apikey: '1b873132a993449d89ef44dd64780638'
	});

	// What's the total count of records in the system?
	ws.get({limit: 0, skip: 0, count: true}).on('success', function(data, response) {
		chrome.extension.sendMessage({action:'update_icon', ct: response.count});
	}).on("error", function(data, response) {
		console.log("Failure: " + response.status)
	}).on("complete", function(data, response) {
		chrome.extension.sendMessage({action:'update_icon', ct: response.count});
	});
	
}
