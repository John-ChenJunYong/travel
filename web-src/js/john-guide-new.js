/**
 * date:2013-5-25 10:16:08;
 * explanation:申请成为旅伴的相关方法;
 */
var GuideNew = {
	active_name : 'active',
	/**
	 * 缓存《以月为单位》的缓存数据
	 * @type {Object}
	 */
	temp_month_data : {},
	/**
	 * 缓存《以周为单位》的缓存数据
	 * @type {Object}
	 */
	temp_week_data : {},
	/**
	 * 缓存《以天为单位》的缓存数据
	 * @type {Object}
	 */
	temp_day_data : {},
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
	 * 如果传递过来的参数当中，含有status且等于edit的时候，
	 * 在页面加载完成后，默认先从textarea当中取值，如果存在有数值的话，则认为是在编辑状态
	 * @param  {[type]} type     [description]
	 * @param  {[type]} schedule [description]
	 * @return {[type]}          [description]
	 */
	initScheduleType : function(opts) {
		var that 		= 	this;
		var opts 		= 	opts || {};
		var schedule 	= 	opts.schedule 	||	$('.schedule-mod');
		var type 		= 	opts.type 		|| 	$('#J-schedule-select').val();
		var status 		= 	opts.status;
		schedule.removeClass(this.active_name);
		$('#J-schedule-' + type).addClass(this.active_name);
		
		// 如果传递过来的参数当中，含有status且等于edit的时候
		if (status != undefined && status == 'edit') {
			var data_textarea = $('#J-schedule-data').val();
			var data_length = $.trim(data_textarea).length;
			// var data_temp_div = $('#J-temp-' + type).text();

			if(!data_length) return false;

			var json = utils.stringToJSON(data_textarea);

			switch (type) {
				case 'month' :
					that.temp_month_data = json;
					break;
				case 'week' :
					that.temp_week_data = json;
					// do something
					break;
				case 'day' :
					that.temp_day_data = json;
					// do something
					break;
			}
			console.log(json);
		}
	},

	/**
	 * 切换选择时间表的类型，分别有：月、周、天这三种类型
	 * @return {[type]} [description]
	 */
	selectScheduleType : function(e) {
		var target 		= 	utils.getTarget(e);
		var $target 	= 	$(target);
		var type 		= 	$target.val();
		var schedule 	= 	$target.parent().parent().find('.schedule-mod');

		this.initScheduleType({
			type : type,
			schedule : schedule
		});

		// 重新赋值相应的缓存数据到缓存元素当中，以便将数据正常提交

		var data;
		if (type == 'month') {
			data = this.temp_month_data;
		} else if (type == 'week') {
			data = this.temp_week_data;
		} else if (type == 'day') {
			data = this.temp_day_data;
		}
		this.conversionData(data, type);
		// var temp_value = $('#J-temp-' + type).html();
		// $('#J-schedule-data').val(temp_value);
	},

	/**
	 * 选择某天的某个时间点
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	chooseScheduleHour : function(e) {
		var that = this;
		var target = utils.getTarget(e);
		var $target = $(target);
		
		var $parents_tr = $target.parent().parent();
		var date_value = $parents_tr.find('.td-day').attr('data-value') || $parents_tr.find('.date-operate .date').text();
		var hour_value = $target.attr('data-value');
		var type = $parents_tr.parents('table').attr('data-type');


		// 在《以天为单位》的情况下
		// 判断是否选择了日期
		if(!date_value || date_value == '选择日期') {
			alert('请先选择日期');
			return false;
		}

		$target.hasClass(that.active_name) ? $target.removeClass(that.active_name) : $target.addClass(that.active_name);

		// 获取选中的时间的值
		this.getChooseScheduleData({
			_type : type,
			_target : $target,
			date_value : date_value,
			hour_value : hour_value
		});

		return false;
	},

	/**
	 * 选择一整天
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	chooseScheduleAllDay : function(e) {
		var that = this;
		var target = utils.getTarget(e);
		var $target = $(target);
		var $parents_tr = $target.parent().parent();
		var check = $parents_tr.find('.check');
		var type = $parents_tr.parents('table').attr('data-type');
		var date_value = $parents_tr.find('.td-day').attr('data-value') || $parents_tr.find('.date-operate .date').text();

		// 在《以天为单位》的情况下
		// 判断是否选择了日期
		if(!date_value || date_value == '选择日期') {
			alert('请先选择日期');
			return false;
		}

		if ($target.hasClass(this.active_name)) {
			$target.removeClass(this.active_name);
			check.removeClass(this.active_name);
		} else {
			$target.addClass(this.active_name);
			check.addClass(this.active_name);
		}

		for (var i = 0; i < check.length; i++) {
			var hour_value = check[i].getAttribute("data-value");
			that.getChooseScheduleData({
				_type : type,
				_target : $(check[i]),
				date_value : date_value,
				hour_value : hour_value,
				mtehod : 'all-day'
			});
		}
	},

	/**
	 * 获取选中的时间的值
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	getChooseScheduleData : function(opts) {
		var temp_month 	= 	this.temp_month_data;
		var temp_week 	= 	this.temp_week_data;
		var temp_day 	= 	this.temp_day_data;

		var that 		= 	this;
		var opts 		= 	opts || {};
		var _type 		= 	opts._type;
		var _target 	= 	opts._target;
		var date_value 	= 	opts.date_value;
		var hour_value 	= 	opts.hour_value;

		if (!_type) return false;
		
		// 事先为当前点击的元素添加一个className
		// 然后根据是否存在这个className来判断是否新增json对象到指定的对象当中
		// _target.hasClass(that.active_name) ? _target.removeClass(that.active_name) : _target.addClass(that.active_name);

		switch(_type) {
			case 'month' :
				temp_month[date_value] = temp_month[date_value] || {};
				_target.hasClass(that.active_name) ? temp_month[date_value][hour_value] = hour_value : delete temp_month[date_value][hour_value]
				// 转换成json字符串，并给相应的DOM元素赋值
				that.conversionData(temp_month, _type);
				break;
			case 'week' :
				temp_week[date_value] = temp_week[date_value] || {};
				_target.hasClass(that.active_name) ? temp_week[date_value][hour_value] = hour_value : delete temp_week[date_value][hour_value]
				// 转换成json字符串，并给相应的DOM元素赋值
				that.conversionData(temp_week, _type);
				break;
			case 'day' :
				temp_day[date_value] = temp_day[date_value] || {};
				_target.hasClass(that.active_name) ? temp_day[date_value][hour_value] = hour_value : delete temp_day[date_value][hour_value]
				// 转换成json字符串，并给相应的DOM元素赋值
				that.conversionData(temp_day, _type);
				break;
			default :
				return false;
		}
	},

	/**
	 * 转换数据
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	conversionData : function(data, type) {
		if (!data || !type) return false;

		var temp_value = utils.jsonToString(data);
		$('#J-schedule-data').val(temp_value);
		$('#J-temp-' + type).html(temp_value);
	},

	/**
	 * 选择日期
	 * @return {[type]} [description]
	 */
	chooseScheduleDay : function(e) {
		var that = this;
		var target = utils.getTarget(e);
		var _this = $(target);
		
		var $parent = _this.parent();
		var $parents_table = _this.parents('table.schedule-list');
		var type = $parents_table.attr('data-type');

		var now_temp = new Date();
		var now = new Date(now_temp.getFullYear(), now_temp.getMonth(), now_temp.getDate(), 0, 0, 0, 0);

		var _datepicker = _this.datepicker({
			format : 'yyyy-mm-dd',
			onRender : function(date){
				return date.valueOf() < now.valueOf() ? 'disabled' : '';
			}
		})
		.datepicker('show')
		.on('changeDate', function(ev){
			// 清空数值
			_this.text('');
			// 之前的日期
			var temp_date = $parent.find('.date').text();
			// 修改后的日期
			var date_value = _this.data('date');
			$parent.find('.date').text(date_value);
			// 处理以天为单位的json对象
			that.temp_day_data[temp_date] = that.temp_day_data[temp_date] || {}
			that.temp_day_data[date_value] = that.temp_day_data[temp_date];
			// 删除之前日期的属性值
			delete that.temp_day_data[temp_date];
			that.conversionData(that.temp_day_data, type);
			// 隐藏日历
			_this.datepicker('hide');
		});
	},

	/**
	 * 根据当前需要，只要在《天》这个类型下，新增一天，需要在后面插入一行表格
	 * @return {[type]} [description]
	 */
	addScheduleNewLine : function(e) {
		var tmpl = this.tmplScheduleNewLine();
		$('#J-schedule-day tbody').append(tmpl);
	},

	/**
	 * 删除某天
	 * @return {[type]} [description]
	 */
	removeScheduleDayLine : function(e) {
		var target = utils.getTarget(e);
		var $parents_tr = $(target).parents('tr');
		var $parents_table = $(target).parents('table.schedule-list');
		var type = $parents_table.attr('data-type');
		var date_value = $parents_tr.find('.date').text();
		if (!$parents_tr.length) return false;

		// 删除某天后，重新将缓存的对象转换成json格式的字符串
		// console.log(this.temp_day_data[date_value]);
		this.temp_day_data[date_value] = {};
		this.conversionData(this.temp_day_data, type);
		// console.log(this.temp_day_data[date_value]);
		$parents_tr.remove();
	},

	/**
	 * 模板：新增一天
	 * @return {[type]} [description]
	 */
	tmplScheduleNewLine : function() {
		var tmpl = [
			'<tr>',
				'<td class="td-day">',
					'<div class="date-operate">',
						'<i class="i-remove"></i>',
						'<span href="javascript:void(0);" class="choose">请选择日期</span>',
						'<span class="date"></span>',
					'</div>',
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
	},

	/**
	 * 在注册成为旅伴的最后一步，提供一键Follow的操作
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	follow : function(opts) {
		var opts 			= 	opts || {};
		var e 				= 	opts.e;
		var followed_name 	= 	opts.followed_name || 'followed';
		var callback 		= 	opts.callback;
		var follow_name 	= 	'follow';
		var target = utils.getTarget(e);
		var _parent = $(target).parent();
		if (_parent.hasClass(followed_name)) {
			_parent.removeClass(followed_name);
			_parent.find('.flag').text(follow_name);
		} else {
			_parent.addClass(followed_name);
			_parent.find('.flag').text(followed_name);
		}

		if(typeof callback === 'function') {
			callback();
		}
	}
}


/**
 * 实例化
 * @return {[type]} [description]
 */
$(function() {
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
	GuideNew.initScheduleType({
		status : 'edit'
	});
	$('#J-schedule-select').on('change', function(e) {
		GuideNew.selectScheduleType(e);
		e.stopPropagation();
	});

	// 为日期当中的《天》绑定增加日期事件
	$('#J-add-service-day').on('click', function(e) {
		GuideNew.addScheduleNewLine(e);
		return false;
	});

	// 为日期当中的《天》绑定切换天数事件
	$('#J-schedule-day .date-operate .choose').live('click', function(e){
		GuideNew.chooseScheduleDay(e);
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

	// 在注册成为旅伴的最后一步，提供一键Follow的操作
	$('.thumbnails-list .pic').on('click', function(e){
		var _this = $(this);
		GuideNew.follow({
			e : e,
			callback : function(){
				console.log('callback');
			}
		});
	});
});