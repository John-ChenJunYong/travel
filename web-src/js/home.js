$(function(){
	$('#myCarousel').carousel();

	$(".home-journey div.item li").hover(function(){
		$(this).find("img").css('opacity','1.0');
		$(this).find("span").css('display','block');
	},
	function(){
		$(this).find("img").css('opacity','0.9');
		$(this).find("span").css('display','none');
	});
});