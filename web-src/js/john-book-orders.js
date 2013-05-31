/**
 * date:2013-5-30 15:47:17;
 * explanation:订单页面的相关方法;
 */
var bookOrders = {
	/**
	 * 正在编辑的模块，默认添加的className
	 * @type {String}
	 */
	edit_class_name : 'status-editing',

	/**
	 * 模块的当前状态
	 * 编辑、非编辑
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	isEdit : function(arg) {
		if (!arg) return false;

		var that = this;
		var _this = arg;

		var _parents = _this.parents('.guide-mod');
		var backdrop = $('.ui-backdrop');
		var tmpl_backdrop = that.tmpl('backdrop');

		if (!backdrop.length) {
			_parents.addClass(that.edit_class_name);
			$('body').append(tmpl_backdrop);
		} else {
			_parents.removeClass(that.edit_class_name);
			backdrop.remove();
		}
		return false;
	},

	/**
	 * 编辑时间表
	 * 需要区分当前是固定行程还是自由行
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	updateSchedule : function(opts) {
		
	},

	/**
	 * 在自由行下，删除景点
	 * 通过指定一个callback进行操作
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	removeAttractions : function(arg){
		if (!arg) return false;

		var that = this;
		var _this = arg;

		var _parents = _this.parent();
		var _parents_wrap = _parents.parent();
		var child = _parents_wrap[0].children;

		_parents.remove();
		if (!child.length) {
			var tmpl = that.tmpl('attractions');
			_parents_wrap.append(tmpl);
		};
		return false;
	},

	
	tmpl : function(type){
		if(!type) return;
		var tmpl;
		switch(type){
			// 景点
			case 'attractions' :
				tmpl = [
					'<li class="empty">您暂时还没有添加任何景点</li>'
				].join('');
				break;
			// 遮罩层，用于在编辑状态下，防止非编辑状态的内容被点击到
			case 'backdrop' :
				tmpl = [
					'<div class="ui-backdrop in"><!-- 遮罩层，用于在编辑状态下，防止非编辑状态的内容被点击到 --></div>'
				].join('');
				break;
		}
		return tmpl;
	},

	/**
	 * 更新参加人数
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	updatePeople : function(arg) {
		if (!arg) return false;

		var that = this;
		var _this = arg;

		var _parents = _this.parents('#J-traveler-join');
		var quantity = _this.parent().find('select').val();

		_parents.find('#J-traveler-quantity').val(quantity);
		_parents.find('.quantity').text(quantity);

		that.isEdit(_this);
		return false;
	},

	/**
	 * 修改见面地点
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	updateMeetPlace : function(arg) {
		if (!arg) return false;

		var that = this;
		var _this = arg;

		var place = _this.parent().find('input[type="text"]').val();
		var _parents = _this.parents('#J-meet-place');
		_parents.find('.J-current-result').text(place);

		that.isEdit(_this);
		return false;

		return false;

		if (!e) return false;
		var that = this;
		var target = utils.getTarget(e);
		var $target = $(target);
		var place = $target.parent().find('input[type="text"]').val();

		var $parents = $target.parents('#J-meet-place');
		$parents.find('.J-current-result').text(place);

		that.isEdit(e);
		e.stopPropagation();
	},

	/**
	 * 重新选择旅伴
	 * @param  {[type]} arg [description]
	 * @return {[type]}     [description]
	 */
	updateCompanion : function(arg) {
		if (!arg) return false;

		var that = this;
		var _this = arg;

		var _parents 		= 	_this.parents('.list-item');
		var _parents_wrap 	= 	_this.parents('.travel-companions');

		// 先将默认的旅伴放到后面，方便用户恢复
		var html = $('#J-companion-active').html();
		var history = $('#J-history-companions');
		if (!history.length) {
			var tmpl = that.tmplHistoryCompanion(html);
			_parents_wrap.after(tmpl);
		}

		var html_avator 	= 	_parents.find('.user').html();
		var html_name 		= 	_parents.find('.name').html();
		var html_price 		= 	_parents.find('.price').html();

		var companion = $('#J-companion-active');
		companion.find('.user').html(html_avator);
		companion.find('.name').html(html_name);
		companion.find('.price').html(html_price);
	},

	/**
	 * 第一次进入到订单页面所选择的旅伴
	 * @return {[type]} [description]
	 */
	tmplHistoryCompanion : function(html) {
		if (!html[0]) return false;
		var tmpl = [
			'<div class="history-companions" id="J-history-companions">',
				'<h4 class="mod-hd-t">Your first choice</h4>',
				'<div class="mod-bd">',
					'<table class="companion-active">',
						html,
					'</table>',
				'</div>',
			'</div>'
		].join('');
		return tmpl;
	}
};

/**
 * date:2013-5-30 15:47:47;
 * explanation:实例化;
 */
$(function(){
	// 复选框
	$('.ui-checkbox').checkbox();

	// 在下单页面，为各个模块绑定编辑事件
	$('.guide-mod .edit').live('click', function(){
		var _this = $(this);
		bookOrders.isEdit(_this);
		return false;
	});

	// 修改参加人数
	$('#J-sure-join').live('click', function(){
		var _this = $(this);
		bookOrders.updatePeople(_this);
	});

	// 修改碰面地址
	$('#J-sure-place').live('click', function(){
		var _this = $(this);
		bookOrders.updateMeetPlace(_this);
	});

	// 重新选择开始时间
	$('#J-start-date, #J-start-date+.i-date').live('click', function(){
		var _this = $(this)
		utils.showDatepicker({
			mod : '#J-start-date',
			callback_change : function(ev){
				console.log(ev);
				console.log(_this);
			}
		});
	});

	// 重新选择旅伴
	$('.travel-companions .ui-btn-small').live('click', function(){
		var _this = $(this);
		bookOrders.updateCompanion(_this);
		return false;
	});


	// 在自由行下，删除景点
	$('.attractions-list .i-remove').live('click', function(){
		var _this = $(this);
		bookOrders.removeAttractions(_this);
		return false;
	});

	/**
	 * 保存按钮的默认事件类型
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$('.btn-wrap .ui-btn-primary').live('click', function(){
		var _this = $(this);
		bookOrders.isEdit(_this);
		e.stopPropagation();
	});
});