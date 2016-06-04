$(document).ready(function(){

	var latitude = 41.2592330;
	var longitude = -96.0334950;
	var params ={
		api_key:"208jico8ty161pguni7ha87e",
		lat: latitude,
		lon: longitude
	};

	var geocoder;
	var map;

	pullEtsyStores(params);

	$(".location-getter").submit(function(event){
		event.preventDefault();
		getLocation($(this).children(".input-box").val());
	});

});

function initMap(){
	 geocoder = new google.maps.Geocoder();
	 map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.702637, lng: -73.989406},
          zoom: 8
    });
}

function getLocation(address){

	geocoder.geocode({address:address}, function(results, status){
		var resultsBox = $("#results");
		var latLong = results[0].geometry.location.lat()+", "+results[0].geometry.location.lng();

		resultsBox.html("<h3>Your latlong is:</h3>");
		resultsBox.append(latLong);
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
				var shopUrl = one.url;
				var shopPic = one.image_url_760x100;
				var shopName = one.shop_name;
			 	// $(".container").append("<p><a href=\""+shopUrl+"\">"+shopName+"</a></p>");
			});
			console.log(data);	
		},
		error: function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});
}




