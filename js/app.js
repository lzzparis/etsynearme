$(document).ready(function(){

	var params ={
		api_key:"208jico8ty161pguni7ha87e",
		lat:0,
		lon:0,
		limit:8
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

		getShops(params);

	})

}


function etsyGet(url,params,successHandle){
	$.ajax({
		url:url,	
		data: params,
		dataType:"jsonp",
		type: "GET",
		// callback:"callback",
		success: successHandle,
		error: function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});
}

//TODO rename to documented method name findAllShops?
function getShops (params){
	var url = "https://openapi.etsy.com/v2/shops.js";
	etsyGet(url,params,shopHandler);
}

function shopHandler(data){
	data.results.forEach(displayShop);
}

function displayShop(shop){
	var shopId = shop.shop_id;
	var shopUrl = shop.url;
	var shopName = shop.shop_name;
	var baseUri = "https://openapi.etsy.com/v2/shops/:shop_id/listings";
	var listingParams = {
			api_key:"208jico8ty161pguni7ha87e", 
			shop_id:shop.shop_id,
			limit:10,
			includes:"MainImage"
		};

	drawShop(shop);

	featuredUri=baseUri+"/featured.js";
	var getFeatured = buildFeaturedHandler(baseUri,listingParams,shop);
	etsyGet(featuredUri,listingParams,getFeatured);

}

function drawShop(shop){
	var shopElem = $(".templates .single-shop").clone();

	shopElem.attr("id",shop.shop_id)

	var nameElem = shopElem.find(".shop-name a");
	nameElem.text(shop.shop_name);

	var titleElem = shopElem.find(".shop-title");
	titleElem.text(shop.title);

	$("#results").append(shopElem);
}


function buildFeaturedHandler(url,params,shop){
	return function(data){
		if(data.count)	displayListings(shop, data);
		else {
			var activeUrl = url+"/active.js";
			var activeHandle = buildActiveHandler(shop);
			etsyGet(activeUrl,params,activeHandle);
		}
	}
}

function buildActiveHandler(shop){
	return function(data){
		displayListings(shop,data);
	}
}


function displayListings(shop, listings){
	var shopUrl = shop.url;
	var shopName = shop.shop_name;

	var listContainElem = $("#"+shop.shop_id).children(".listings-container");

	listings.results.forEach(function(oneListing){
		var listingElem = $(".templates .listing").clone();
		var listImageElem = listingElem.find(".listing-image");
		listImageElem.css({"background-image":"url('"+oneListing.MainImage.url_570xN+"'')"});

		var listTitleElem = listingElem.find(".listing-title");
		listTitleElem.text(oneListing.title);
		listContainElem.append(listingElem);
	});

}

