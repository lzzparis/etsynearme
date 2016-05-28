$(document).ready(function(){

	var params ={
		// api_key:,


	}
	var url="https://openapi.etsy.com/v2/shops";
	$.getJSON(url,params,function(data){
		console.log(data)
	});
});