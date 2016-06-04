$(document).ready(function(){

	var latitude = 41.2592330;
	var longitude = -96.0334950;
	var params ={
		api_key:"208jico8ty161pguni7ha87e",
		lat: latitude,
		lon: longitude
	};
	var url="https://openapi.etsy.com/v2/shops.js";
	$.ajax({
		url:url,	
		data: params,
		dataType:"jsonp",
		type: "GET",
		// callback:"callback",
		success: function(data){
				console.log(data);
				data.results.forEach(function(one){
				var shopUrl = one.url;
				var shopPic = one.image_url_760x100;
				var shopName = one.shop_name;
				$(".container").append("<a href=\""+shopUrl+"\"><img src=\""+shopPic+"\"></a>");
				$(".container").append("<a href=\""+shopUrl+"\">"+shopName+"</a>");
				});

		},
		error: function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});
});

