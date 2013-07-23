var deviceInfo = function(){
	console.log('abc');
	//navigator.notification.alert("name");
	$('.app').html('xxx.');
};

function init(){
	document.addEventListener("deviceready", deviceInfo, true);
}




//EDIT THESE LINES
//Title of the blog
var TITLE = "Ivan's Blog";
//RSS url
var RSS = "http://casarvip.com.br/rss";
//Stores entries
var entries = [];
var selectedEntry = "";




function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");

	//listen for detail links
	$(".contentLink").on("click", function() {
		selectedEntry = $(this).data("entryid");
	});
}

//Listen for Google's library to load
function initialize() {
	console.log('ready to use google');
	var feed = new google.feeds.Feed(RSS);
	feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
	feed.setNumEntries(10);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Error - "+result.error.message);
			if(localStorage["entries"]) {
				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"]);
				renderEntries(entries);				
			} else {
				$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
			}
		}
	});
}

//Listen for main page
$("#mainPage").on("pageinit", function() {
	//Set the title
	console.log('ivan');
	$("h1", this).text(TITLE);
	
	google.load("feeds", "1",{callback:initialize});
});

$("#mainPage").on("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").on("pageshow", function(prepage) {
	//Set the title
	console.log('SELECTEDENTRY: ' + selectedEntry);
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" class="fullLink" data-role="button">Read Entry on Site</a>';
	$("#entryText",this).html(contentHTML);
	$("#entryText .fullLink",this).button();

});
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.plugins.childBrowser.showWebPage($(this).attr("href"));
});