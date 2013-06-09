/**
 * date:2013-6-8 15:31:22;
 * explanation:用户付款相关页面：包括自己主动付款、代付款页面;
 */

$(function(){
	// 为所有带着相应data属性的标签绑定tooltip方法
	$('[data-toggle=tooltip]').tooltip();

	////////////////////////
	// 防止代别人付款的用户随意点确认付款
	// 必须勾选前面的复选框才能帮别人代付
	////////////////////////
	$('#J-checkbox-agree').live('change', function(){
		
	});
});