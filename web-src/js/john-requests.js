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

	$('#J-itinerary-modal').on('hidden', function(){
		var data = $(this).data();
		$(this).removeData('modal');
	});

	// 时间表
	GuideNew.initScheduleType({
		status : 'edit'
	});
});