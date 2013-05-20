$(function(){

	$(".topbar .top-lang .dropdown-menu li").click(function(){
		var lang = $(this).data('lang');
		$.cookie('language', lang, { expires: 30, path: '/' });
		window.location.reload();
	});


	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

	var datepicker = $(".carousel-search-date").datepicker({
		onRender: function(date) {
		    return date.valueOf() < now.valueOf() ? 'disabled' : '';
		}
    }).data('datepicker');
	if(datepicker.picker){
	    datepicker.picker.addClass("datepicker-no-arrow");
	}

	var datepicker = $(".topbar-search-date").datepicker({
		onRender: function(date) {
		    return date.valueOf() < now.valueOf() ? 'disabled' : '';
		}
    }).data('datepicker');
	if(datepicker.picker){
	    datepicker.picker.addClass("datepicker-no-arrow");
	}

	Comm.googlePlace($('.topbar-search-city')[0]);

	$('.topbar-search-city').focus(function(){
		$('.pac-container').css('z-index', 9999);
	});

	$('.topbar-partner-circle').click(function(){
		$(this).toggleClass('active');
		$('.topbar-partner-list').toggle();
	});


    //表单的处理
	$(".simpleform").simpleForm();

});