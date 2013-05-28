/**
 * date:2013-5-25 10:16:08;
 * explanation:申请成为旅伴的相关方法;
 */
// var temp_schedule_data = {};




var GuideNew = {
	active_name : 'active',
	temp_schedule_data : {},
	/**
	 * 在Modal当中选择某个地点的文本的时候，需要为它添加一个className
	 * @return {[type]} [description]
	 */
	clickLocationTxt : function(opts) {
		var opts = opts || {};
		var e = opts.e;
		var callback = opts.callback;
		var target = utils.getTarget(e);
		$(target).addClass(this.active_name).siblings().removeClass(this.active_name);

		if(typeof callback === 'function') {
			callback();
		}
	},

	/**
	 * 删除某个已经添加过的地址
	 * @return {[type]} [description]
	 */
	removeLocation : function(opts){
		var opts = opts || {};
		var e = opts.e;
		var callback = opts.callback;
		var target = utils.getTarget(e);
		$(target).parent().remove();

		if(typeof callback === 'function') {
			callback();
		}
	},

	/**
	 * 初始化选择时间表的类型，会根据当前select所选中的值进行自动切换到指定的时间表
	 * @param  {[type]} type     [description]
	 * @param  {[type]} schedule [description]
	 * @return {[type]}          [description]
	 */
	initScheduleType : function(type, schedule) {
		var schedule 	= 	schedule 	||	$('.schedule-mod');
		var type 		= 	type 		|| 	$('#J-schedule-select').val();
		schedule.removeClass(this.active_name);
		$('#J-schedule-' + type).addClass(this.active_name);
	},

	/**
	 * 切换选择时间表的类型，分别有：月、周、天这三种类型
	 * @return {[type]} [description]
	 */
	selectScheduleType : function(e) {
		var target = utils.getTarget(e);
		var type 		= 	$(target).val();
		var schedule 	= 	$(target).parent().parent().find('.schedule-mod');

		this.initScheduleType(type, schedule);
		// this.temp_schedule_data = {};

		// var temp_value = $('#J-temp-' + type).html();
		// $('#J-schedule-data').val(temp_value);
	},

	/**
	 * 选择某天的某个时间点
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	chooseScheduleHour : function(e) {
		var target = utils.getTarget(e);
		var _target = $(target);

		var temp_date = this.temp_schedule_data;

		var _parents = _target.parent().parent();
		var day_value = _parents.find('.td-day').attr('data-value');
		var hour_value = _target.attr('data-value');
		var type = _parents.parents('table').attr('data-type');


		temp_date[day_value] = temp_date[day_value] || {};
		
		if (_target.hasClass(this.active_name)) {
			_target.removeClass(this.active_name);
			delete temp_date[day_value][hour_value]
		} else {
			_target.addClass(this.active_name);
			temp_date[day_value][hour_value] = hour_value;
		}

		// 转换成json字符串，并给相应的DOM元素赋值
		var temp_value = utils.jsonToString(temp_date);
		
		$('#J-schedule-data').val(temp_value);
		$('#J-temp-' + type).html(temp_value);
		return false;
	},

	/**
	 * 选择一整天
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	chooseScheduleAllDay : function(e) {
		var target = utils.getTarget(e);
		var _target = $(target);
		var _parents = _target.parent().parent();

		if (_target.hasClass(this.active_name)) {
			_target.removeClass(this.active_name);
			_parents.find('.check').removeClass(this.active_name);
		} else {
			_target.addClass(this.active_name);
			_parents.find('.check').addClass(this.active_name);
		}
	},

	/**
	 * 选择日期
	 * @return {[type]} [description]
	 */
	chooseScheduleDay : function(opts) {
		var opts = opts || {};
		var target_name = opts.target_name || '.J-date';
		var choose_day = $(target_name).datepicker({
			onRender: function(date) {
				var nowTemp = new Date();
				var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
				return date.valueOf() < now.valueOf() ? 'disabled' : '';
			}
		}).on('changeDate', function() {
			choose_day.hide();
		}).data('datepicker');
	},

	/**
	 * 根据当前需要，只要在《天》这个类型下，新增一天，需要在后面插入一行表格
	 * @return {[type]} [description]
	 */
	addScheduleNewLine : function(e) {
		var target = utils.getTarget(e);
		var tmpl = this.tmplScheduleNewLine();
		$('#J-schedule-day tbody').append(tmpl);
		this.chooseScheduleDay();
	},

	/**
	 * 删除某天
	 * @return {[type]} [description]
	 */
	removeScheduleDayLine : function(e) {
		var target = utils.getTarget(e);
		var _parents = $(target).parents('tr');

		if (!_parents.length) return false;

		_parents.remove();
	},

	/**
	 * 模板：新增一天
	 * @return {[type]} [description]
	 */
	tmplScheduleNewLine : function() {
		var tmpl = [
			'<tr>',
				'<td class="td-day">',
					'<div class="operate"><i class="i-remove"></i></div>',
					'<input type="text" value="选择日期" class="J-date" />',
				'</td>',
				'<td><label class="check" data-value="0"></label></td>',
				'<td><label class="check" data-value="1"></label></td>',
				'<td><label class="check" data-value="2"></label></td>',
				'<td><label class="check" data-value="3"></label></td>',
				'<td><label class="check" data-value="4"></label></td>',
				'<td><label class="check" data-value="5"></label></td>',
				'<td><label class="check" data-value="6"></label></td>',
				'<td><label class="check" data-value="7"></label></td>',
				'<td><label class="check" data-value="8"></label></td>',
				'<td><label class="check" data-value="9"></label></td>',
				'<td><label class="check" data-value="10"></label></td>',
				'<td><label class="check" data-value="11"></label></td>',
				'<td><label class="check" data-value="12"></label></td>',
				'<td><label class="check" data-value="13"></label></td>',
				'<td><label class="check" data-value="14"></label></td>',
				'<td><label class="check" data-value="15"></label></td>',
				'<td><label class="check" data-value="16"></label></td>',
				'<td><label class="check" data-value="17"></label></td>',
				'<td><label class="check" data-value="18"></label></td>',
				'<td><label class="check" data-value="19"></label></td>',
				'<td><label class="check" data-value="20"></label></td>',
				'<td><label class="check" data-value="21"></label></td>',
				'<td><label class="check" data-value="22"></label></td>',
				'<td><label class="check" data-value="23"></label></td>',
				'<td class="td-all"><label class="checkall"></label></td>',
			'</tr>'
		].join('');
		return tmpl;
	}
}


/**
 * 实例化
 * @return {[type]} [description]
 */
$(function() {

	// var xx = {}
	// xx.tuesday = {};
	// var aa = 'a'
	// xx.tuesday[aa] = 15;
	// console.log(xx);


	// var xxx = []
	// xxx.tuesday = {};
	// var aaa = 'a'
	// xxx.tuesday[aaa] = 15;
	// console.log(xxx);	

	// 在地图上方添加地址的时候，弹出浮层，并渲染滚动条
	$('.location-list li[data-toggle=modal]').on('click', function() {
		// 点击后弹出浮层
		$('#J-modal-location').modal();
		// 重新渲染滚动条
		$('#J-location-list').scrollbar();
		// 点击地址文本
		$('#J-location-list li:not(.example)').on('click', function(e) {
			console.log('aaa');
			GuideNew.clickLocationTxt({
				e : e,
				callback : function() {
					// do something
					// 例如在这里进行ajax
				}
			});
		});
	});

	// 删除某个已经添加过的地址
	$('.location-list .i-remove').live('click', function(e) {
		GuideNew.removeLocation({
			e : e,
			callback : function() {
				// do something
				// 例如在这里进行ajax
			}
		});
	});

	// 选择某天的某个时间点
	$('.schedule-list .check').live('click', function(e){
		GuideNew.chooseScheduleHour(e);
		return false;
	});

	// 选择一整天
	$('.schedule-list .checkall').live('click', function(e){
		GuideNew.chooseScheduleAllDay(e);
		return false;
	});
	
	// 成为旅伴的时候，需要切换选择服务时间类型
	GuideNew.initScheduleType();
	$('#J-schedule-select').on('change', function(e) {
		GuideNew.selectScheduleType(e);
		e.stopPropagation();
	});

	// 为日期当中的《天》绑定日期选择事件
	GuideNew.chooseScheduleDay();

	// 为日期当中的《天》绑定增加日期事件
	$('#J-add-service-day').on('click', function(e) {
		GuideNew.addScheduleNewLine(e);
		return false;
	});

	// 为日期当中的《天》绑定删除日期事件
	$('#J-schedule-day tbody tr').live('mouseover', function(e){
		var _this = $(this);
		_this.find('.i-remove').show();
		e.stopPropagation();
	}).live('mouseout', function(e){
		var _this = $(this);
		_this.find('.i-remove').hide();
		e.stopPropagation();
	});
	$('#J-schedule-day .i-remove').live('click', function(e){
		GuideNew.removeScheduleDayLine(e);
		return false;
	});
});