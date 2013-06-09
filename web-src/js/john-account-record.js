/**
 * date:2013-6-4 15:15:57;
 * explanation:账户相关记录，包括提款记录、积分记录、收入记录;
 */

$(function(){
	// 弹出增加提现方式的浮窗
	// 也可以按照bootstrap的方式，直接在html代码里写，主要增加以下属性
	// data-toggle="modal" data-target="#the id"
	$('#J-add-method').live('click', function(){
		$('#J-withdrawals-method-modal').modal('show')
	});
});