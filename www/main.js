var deviceInfo = function(){	
	//navigator.notification.alert("name");
};

function init(){
	document.addEventListener("deviceready", deviceInfo, true);
}




//EDIT THESE LINES
//Title of the blog
var TITLE = "Casar VIP";
//RSS url
var RSS = "http://casarvip.com.br/rss";
//Stores entries
var entries = [];
var selectedEntry = "";




function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        var regex = /<img.*?src="(.*?)"/;        
        var matchs = regex.exec(v.content);
        var src = "";
        if( matchs!=null ) src = matchs[1];
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">';
        s += '<div class="contentData" style="background-image: url(' + "'" + src + "'" + ');"> <span>' +  v.title  + '</span></div>';
        s += '</a></li>';
    });
    $("#linksList").html(s);
    //$("#linksList").listview("refresh");

	//listen for detail links
	$(".contentLink").on("click", function() {
		selectedEntry = $(this).data("entryid");
	});
}

//Listen for Google's library to load
function initialize() {	
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
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" class="fullLink" data-role="button">Ler no Site</a>';
	$("#entryText",this).html(contentHTML);
	$("#entryText .fullLink",this).button();

});

$("#sitePage").on("pageshow", function(prepage) {
  
  window.plugins.childBrowser.showWebPage('www.casarvip.com.br');
});
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.plugins.childBrowser.showWebPage($(this).attr("href"));
});