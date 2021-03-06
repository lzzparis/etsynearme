var geocoder;
var lastGeocode="";
var params ={
	api_key:"208jico8ty161pguni7ha87e", 
	lat:0, 
	lon:0, 
	limit:8, 
	page:1
};

$(document).ready(function() {

	$(".location-getter").submit(function(event) {
		event.preventDefault();

		//reset results
		$("#results").html("");

		var locationInput = $(this).children(".input-box").val();

		//Shrink the banner
		$(".banner").css("height", "18vh");
		if($("html").width() < 390) {
			$(".title").css({"font-size":"1.75rem", "margin-bottom":"0.5rem"});
			$(".location-getter").css({
				"top":"15%", 
			});
		}
		else{
			$(".title").css({"font-size":"3rem", "margin-bottom":"0.5rem"});
			$(".location-getter").css({
				"top":"10%", 
			});
		}
		$(".input-box").css("font-size", "1rem");
		$(".input-button").css("font-size", "0.75rem");

		getLocation(params, locationInput);
	});

	var win = $(window);
	win.scroll(function() {
		// End of the document reached?
		if ($(document).height() - win.height() == win.scrollTop()) {
			getShops(params);
		}
	});
});

function initGeocoder() {
	 geocoder = new google.maps.Geocoder();
}

function getLocation(params, address) {
	geocoder.geocode({address:address}, function(results, status) {
		var resultsBox = $("#results");
		params.lat = results[0].geometry.location.lat();
		params.lon = results[0].geometry.location.lng();

		if(results[0].place_id !== lastGeocode) {
			getShops(params);
			lastGeocode = results[0].place_id;
		}
	});
}

//Generic GET AJAX helper for Etsy API
function etsyGet(url, params, successHandle) {
	$.ajax({
		url:url, 	
		data: params, 
		dataType:"jsonp", 
		type: "GET", 
		success: successHandle, 
		error: function(jqXHR, error) { //this waits for the ajax to return with an error promise object
		 console.log(jqXHR	);
		 console.log(error);
		}
	});
}

function getShops (params) {
	var url = "https://openapi.etsy.com/v2/shops.js";
	etsyGet(url, params, shopHandler);
	params.page  += 1;
}

function shopHandler(data) {
	data.results.forEach(prepShop);
}

function prepShop(shop) {
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

	featuredUri = baseUri + "/featured.js";
	var getFeatured = buildFeaturedHandler(baseUri, listingParams, shop);
	etsyGet(featuredUri, listingParams, getFeatured);
}

function drawShop(shop) {
	var shopElem = $(".templates .single-shop").clone();

	shopElem.attr("id", shop.shop_id)

	var nameElem = shopElem.find(".shop-name a");
	nameElem.text(shop.shop_name);
	nameElem.attr("href", shop.url);

	var titleElem = shopElem.find(".shop-title");
	titleElem.text(shop.title || "");

	$("#results").append(shopElem);
}


function buildFeaturedHandler(url, params, shop) {
	return function(data) {
		if(data.count)	{
			displayListings(shop, data);
		}

		else {
			var activeUrl = url + "/active.js";
			var activeHandle = buildActiveHandler(shop);
			etsyGet(activeUrl, params, activeHandle);
		}
	}
}

function buildActiveHandler(shop) {
	return function(data) {
		displayListings(shop, data);
	}
}


function displayListings(shop, listings) {
	var shopUrl = shop.url;
	var shopName = shop.shop_name;

	if (listings.count) {
		drawShop(shop);

		var listContainElem = $("#" + shop.shop_id).children(".listings-container");

		listings.results.forEach(function(oneListing) {
			var listingElem = $(".templates .listing").clone();
			var listImageElem = listingElem.find(".listing-image");
			listImageElem.css("background-image", "url('" + oneListing.MainImage.url_570xN + "')");

			var listTitleElem = listingElem.find(".listing-title");
			listTitleElem.html(oneListing.title);

			var listLinkElem = listingElem.find("a");
			listLinkElem.attr("href", oneListing.url);

			listContainElem.append(listingElem);
		});

		$("#results").css("display", "inline-block");
	}
}

