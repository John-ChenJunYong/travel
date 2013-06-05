/**
 * date:2013-6-4 15:15:57;
 * explanation:旅客提交需求;
 */

$(function(){
	// 为元素绑定popover事件
	$('a[data-toggle=popover]')
	.popover({
		placement : 'top'
	})
	.on('click', function(e){
		e.preventDefault();
	});


	$('#J-itinerary-list a').on('click', function(e){
		var _this = $(this);
		var remote = _this.attr('href');

		// console.log(remote);

		// $("#J-itinerary-modal").modal({
		// 	remote : remote
		// });

		$("#J-itinerary-modal").modal({
			show : function(){
				console.log('bb')
			}
		}).on('shown', function(){
			console.log('a');
		});


		e.stopPropagation();
		return false;
	});


	// $("#J-itinerary-modal").modal('show').on('hidden', function(){
	// 	console.log('hidden');
	// }).on('show', function(){
	// 	console.log('show');
	// });

	// $('#J-itinerary-modal').live('show', function(){
	// 	console.log('aa');
	// 	/**
	// 	 * 画廊
	// 	 */
	// 	$("#J-gallery .gallery-thumb-list").PikaChoose({
	// 		autoPlay : false,
	// 		carousel:true,
	// 		carouselOptions : {
	// 			visible: 11,
	// 			itemFallbackDimension: 300,
	// 			buttonNextHTML : '<span></span>',
	// 			buttonPrevHTML : '<span></span>'
	// 		}
	// 	});
	// })
});