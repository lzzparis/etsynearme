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
	var shopUrl = shop.url;
	var shopPic = shop.image_url_760x100;
	var shopName = shop.shop_name;
 	$("#results").append("<p><a href=\""+shopUrl+"\" target=\"_blank\">"+shopName+"</a></p>");


			
}




