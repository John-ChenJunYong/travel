/**
 * date:2013-6-4 15:15:57;
 * explanation:旅客提交需求;
 */


var richEditor = {
	/**
	 * 将指定输入框数据插入到目标输入框
	 * @param  {[type]} opts [description]
	 * @param  {[type]} arg [指定事件目标，一般指哪个元素点击导致该事件被调用]
	 * @param  {[type]} source [指定输入框]
	 * @param  {[type]} target [目标输入框]
	 * @return {[type]} 	 [description]
	 */
	insert : function(opts) {
		var opts 			=	opts || {};
		var arg 			=	opts.arg;			
		var target 			=	opts.target;
		var source 			=	opts.source;

		var that 			= 	this;
		var _this 			= 	arg;

		var position 		= 	_this.attr('data-position');
		var val_target 		= 	target.val();
		var val_source 		= 	source.val();

		var val_temp;

		switch (position) {
			case 'replace' :
				val_temp 	= 	val_source;
				break;
			case 'prepend' :
				val_temp 	= 	val_source + '\n\n' + val_target;
				break;
			case 'append' :
				val_temp 	= 	val_target + '\n\n' + val_source;
				break;
			case 'cancel' :
				return true;
		}
		target.val(val_temp);
	}
}

$(function(){
	// 为元素绑定popover事件
	$('a[data-toggle=popover]')
	.popover({
		placement : 'top'
	})
	.on('click', function(e){
		e.preventDefault();
	});

	// 弹出行程套餐
	$('#J-itinerary-modal').on('hidden', function(){
		var data = $(this).data();
		$(this).removeData('modal');
	});

	// 时间表
	GuideNew.initScheduleType({
		status : 'edit'
	});

	// 弹出行程安排的模板
	$('#J-act-gettmpl').live('click', function(){
		$('#J-itinerary-tmpl').modal('show');
	});

	// 简单的插入、替换文本
	$('#J-replace').live('click', function(){
		richEditor.insert({
			position : 'replace'
		});
	});

	$('#J-itinerary-tmpl .ui-btn-small').live('click', function(){
		var _this = $(this);
		var target = $('#J-input-itinerary');
		var source = _this.parent().parent().find('textarea.input-tmpl');
		richEditor.insert({
			arg : _this,
			target : target,
			source : source
		});
		return false;
	});

	
});