/*
* ͨ�õ�JS��
*/
window.Comm = {
	//��ʼ��Google Place��������
	googlePlace: function(input){
		if (window.google) {
		    var autocomplete = new google.maps.places.Autocomplete(input, {types: ["geocode"]});
		}
	}
};
