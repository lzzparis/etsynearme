$(document).ready(function(){

	var latitude = 41.2592330;
	var longitude = -96.0334950;
	var params ={
		api_key:"208jico8ty161pguni7ha87e",
		lat: latitude,
		lon: longitude
	};

	var geocoder;
	var location;

	
	$(".location-getter").submit(function(event){
		event.preventDefault();
		var locationInput = $(this).children(".input-box").val();
		getLocation(params,locationInput);
	});

});

function initGeocoder(){
	 geocoder = new google.maps.Geocoder();

}

function getLocation(params,address){

	geocoder.geocode({address:address}, function(results, status){
		var resultsBox = $("#results");
		params.lat = results[0].geometry.location.lat();
		params.lon = results[0].geometry.location.lng();

		resultsBox.html("<h3>Your latlong is:</h3>");
		resultsBox.append(params.lat+", "+params.lon);

		pullEtsyStores(params);

	})

}

//TODO rename to doc method name findAllShops
function pullEtsyStores (params){
	$.ajax({
		url:"https://openapi.etsy.com/v2/shops.js",	
		data: params,
		dataType:"jsonp",
		type: "GET",
		// callback:"callback",
		success: function(data){
			data.results.forEach(function(one){
				displayShop(one);
			});
			console.log(data);	
		},
		error: function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});
}

function displayShop(shop){

	var shopId = shop.shop_id;

	//TODO - figure out why this isn't returning anythings
	// var shopElem = $(".templates .single-shop").clone();

	//TODO move the div creation from displayListings to here

	$.ajax({
		url:"https://openapi.etsy.com/v2/shops/:shop_id/listings/featured.js",	
		data:{
			api_key:"208jico8ty161pguni7ha87e", 
			shop_id:shopId,
			limit:10
		},
		dataType:"jsonp",
		type: "GET",
		// callback:"callback",
		success: function(data){
			displayListings(shop, data);
		},
		error: function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});




}

function displayListings(shop, listings){
	var shopUrl = shop.url;
	var shopPic = shop.image_url_760x100;
	var shopName = shop.shop_name;
	console.log(listings);

	//TODO if no featured, do another ajax call

	$("#results").append("<div id=\""+shop.shop_id+"\"class=\"single-shop\">"+
		"<h2 class=\"shop-name\">"+
			"<a href=\""+shopUrl+"\" target=\"_blank\">"+shopName+"</a>"+
		"</h2>"+
		"<ul class=\"listings-list\">");
	listings.results.forEach(function(one){
		$("#"+shop.shop_id).children("ul").append("<li class=\"listings-item\">"+
				"<a href=\""+one.url+"\" target=\"_blank\">"+one.title+"</a>"+
			"</li>");
	
	});
}




