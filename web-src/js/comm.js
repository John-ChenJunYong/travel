/*
* 通用的JS类
*/
window.Comm = {
	//初始化Google Place的搜索框
	googlePlace: function(input){
		if (window.google) {
		    var autocomplete = new google.maps.places.Autocomplete(input, {types: ["geocode"]});
		}
	}
};
