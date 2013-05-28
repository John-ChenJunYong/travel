/**
 * utils
 * @param  {[type]} $                     [description]
 * @param  {[type]} document){})(jQuery [description]
 * @param  {[type]} document              [description]
 * @return {[type]}                       [description]
 */

/**
 * 防止IE当中没有console.log这个方法而报错
 */
if(!window.console){
	var console = {};
	console.log = function(text){}
}

;;;(function($, document){
	/**
	 * 单选框、复选框change事件
	 * 因为兼容IE8，所以UI效果统一在外面包一些label
	 * 根据按钮是否选中，进而修改label的clas name
	 *
	 * $('.ui-checkbox').checkbox();
	 * 
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	$.fn.checkbox = function(opts){
		var defaults = {}
		var opts = $.extend({}, defaults, opts);

		return this.each(function(){

			var _this = $(this);
			var input = _this.find('input[type=checkbox], input[type=radio]');
			if(!input.length) return;
			var type = input.attr('type');
			
			
			var Checkbox = {
				// 自动为已经选中的input增加一个相应的className
				autoAddClass : function(checked){
					if(checked){
						_this.addClass(auto_class_name);
					} else {
						_this.removeClass(auto_class_name);
					}
				},
				// 根据当前的input类型，返回相应的className
				uiClassName : function(type){
					return class_name = type == 'checkbox' ? 'ui-checked' : 'ui-radioed';
				}
			}


			var auto_class_name = Checkbox.uiClassName(type);
			var input_checked = input.attr('checked');
			Checkbox.autoAddClass(input_checked);

			// 为input绑定change事件
			input.live('change', function(){
				var __this 				= 	$(this);
				var checked_type 		= 	__this.attr('type');
				var checked_checked 	= 	__this.attr('checked');
				var checked_name 		= 	__this.attr('name');
				var checked_class_name 	= 	Checkbox.uiClassName(checked_type);

				// 如果是radio的话，清除页面所有相同name的radio
				if(checked_type == 'radio'){
					$('input[name=' + checked_name + ']').parent().removeClass(checked_class_name);
				}

				// 如果change后，当前是选中状态，则增加className，否则清除className
				checked_checked ? _this.addClass(checked_class_name) : _this.removeClass(checked_class_name);
			});
		});
		return false;
	}

	/**
	 * 鼠标滚轮事件
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	$.fn.mousewheel = function(callback){
		return this.each(function() {
			var _self = this;
			_self.direction = 0; //滚动方向
			if (!window.Components) {
				_self.onmousewheel = function() {
					_self.direction = event.wheelDelta;
					event.returnValue = false;
					callback && callback.call(_self);
				};
			} else {
				_self.addEventListener("DOMMouseScroll", function(e) {
					_self.direction = e.detail > 0 ? -1 : 1;
					e.preventDefault();
					callback && callback.call(_self);
				}, false);
			}
		});
	}

	/**
	 * 滚动条
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	$.fn.scrollbar = function(opts){
		var defaults = {
			// 滚动条默认宽度
			width : '14px',
			bg : '#efefef',
			img : '',
			// 滚动区域的背景及控制条的默认外观
			bar : {
				position : 'up',
				bg : {
					_default: "#000",
					_hover: "red"
				},
				control : {
					_default: "green",
					_hover: "#fff",
					_focus: "orange"
				}
			},
			// 上、下按钮的默认外观
			btn : {
				visibility : true,
				up : {
					_default: "green",
					_hover: "#fff",
					_focus: "orange"
				},
				down : {
					_default: "green",
					_hover: "#fff",
					_focus: "orange"
				}
			},
			// 滚动时候触发的方法
			callback : function(){}
		}
		var opts = $.extend({}, defaults, opts);

		return this.each(function(){
			var _self = this;
			var _this = $(this);
			var s_time,
				sp = 0,
				is_up = 0;

			// 为窗口设置必要属性，防止溢出
			_this.css({
				'position' : 'relative',
				'padding' : '0px',
				'overflow' : 'hidden'
			});

			var this_width = _this.width()
			var	this_height = _this.height();
			var scrollbar_width = opts.width ? parseInt(opts.width) : 21;
			var scrollbar_btn_width = opts.btn.visibility ? scrollbar_width : 0;



			// 检测是否存在滚动的DOM元素
			var dom_scroll_content = _this.find('.scroll-content');
			if(!dom_scroll_content.length){
				_this.wrapInner('<div class="scroll-content" style="position:relative; top:0px; zoom:1;"></div>');
			}

			var dom_scroll_wrap = _this.find('.ui-scroll-wrap');
			if(!dom_scroll_wrap.length){
				var tmpl_scroll = [
					'<div class="ui-scroll-bar">',
						'<span class="up"></span>',
						'<span class="dragger">',
							'<span class="dragger-bd">',
								'<b></b>',
							'</span>',
						'</span>',
						'<span class="down"></span>',
					'</div>'
				].join('');
				_this.append(tmpl_scroll);
			}

			var scroll_content = _this.find('.scroll-content');
			var scroll_bar = _this.find('.ui-scroll-bar');
			var scroll_dragger = _this.find('.dragger');
			var scroll_btn_up = _this.find('.up');
			var scroll_btn_dowm = _this.find('.down');

			scroll_dragger.css({
				top: scrollbar_width
			});

			
			var scroll_content_height = scroll_content.height();
			var scroll_bar_height = parseInt(this_height - scrollbar_btn_width * 2);
			// var scroll_bar_height = parseInt(this_height);
			var scroll_height = parseInt(scroll_bar_height * this_height / scroll_content_height);

			if(scroll_height < 20){
				scroll_height = 20;
			}
			// 滚动幅度
			var scroll_extent = scroll_height / 6;
			var current_top = 0,
				allow_scroll = false;
			// scroll_bar.height(scroll_bar_height);
			scroll_bar.height(this_height);
			scroll_dragger.height(scroll_height);

			// 判断是否出现滚动条
			if(scroll_content_height <= this_height){
				scroll_bar.css({
					'display' : 'none'
				});
			} else {
				scroll_content.css({
					'padding-right' : scrollbar_width
				});
				allow_scroll = true;
			}

			if(opts.bar.position != 'up'){
				current_top = this_height - scroll_height - scrollbar_btn_width;
				setTop();
			}
			
			scroll_dragger.bind('mousedown', function(e) {
				opts['callback'] && opts['callback'].call(_self);
				is_up = 1;
				
				var pageY = e.pageY,
					t = parseInt($(this).css("top"));
				$(document).mousemove(function(e2) {
					current_top = t + e2.pageY - pageY; //pageY浏览器可视区域鼠标位置，screenY屏幕可视区域鼠标位置
					setTop();
				});
				$(document).mouseup(function() {
					is_up = 0;
					$(document).unbind();
				});
				return false;
			});

			scroll_btn_up.bind('mousedown', function(e){
				opts['callback'] && opts['callback'].call(_self);
				is_up = 1;
				_self.setTimeOut('up');
				$(document).mouseup(function(){
					is_up = 0;
					$(document).unbind();
					clearTimeout(time_out);
					sp = 0;
				});
				return false;
			});

			scroll_btn_dowm.bind('mousedown', function(e) {
				opts['callback'] && opts['callback'].call(_self);
				is_up = 1;
				_self.setTimeOut('down');
				$(document).mouseup(function() {
					is_up = 0;
					$(document).unbind();
					clearTimeout(time_out);
					sp = 0;
				});
				return false;
			});

			_self.setTimeOut = function(direction){
				var __self = this;
				if(direction == 'up'){
					current_top -= scroll_extent;
				} else {
					current_top += scroll_extent;
				}
				setTop();

				sp += 2;
				var duration = 500 - sp * 50;
				if (duration <= 0) {
					duration = 0
				};
				time_out = setTimeout(function() {
					__self.setTimeOut(direction);
				}, duration);
			}

			scroll_bar.bind('mousedown', function(e){
				opts['callback'] && opts['callback'].call(_self);
				current_top = current_top + e.pageY - scroll_dragger.offset().top - scroll_height / 2;
				asetTop();
				return false;
			});

			function setTop(){
				if(current_top < scrollbar_width){
					current_top = scrollbar_width;
				}
				if(current_top > this_height - scroll_height - scrollbar_width){
					current_top = this_height - scroll_height - scrollbar_width
				}
				scroll_dragger.css({
					'top' : current_top
				});
				var scroll_content_top = -((current_top - scrollbar_width) * scroll_content_height / (this_height - 2 * scrollbar_width));
				scroll_content.css({
					'top': scroll_content_top
				});
			}

			function asetTop() {
				if (current_top < scrollbar_btn_width) {
					current_top = scrollbar_btn_width;
				}
				if (current_top > this_height - scroll_height - scrollbar_btn_width) {
					current_top = this_height - scroll_height - scrollbar_btn_width;
				}
				scroll_dragger.stop().animate({
					top: current_top
				}, 100);
				var scroll_content_top = -((current_top - scrollbar_btn_width) * scroll_content_height / (this_height - 2 * scrollbar_btn_width));
				scroll_content.stop().animate({
					top: scroll_content_top
				}, 100);
			};

			_this.mousewheel(function(){
				if (allow_scroll != true) return;
				opts['callback'] && opts['callback'].call(_self);

				if (this.direction > 0) {
					current_top -= scroll_extent;
				} else {
					current_top += scroll_extent;
				};

				setTop();
			})
		});
	}

	/**
	 * 简易版：仿facebook帮助中心的滑动菜单
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	$.fn.sliderMenu = function(opts){
		var defaults = {
			parents : '#J-slider-menu',		// 最外层的容器
			slider : '.slider',				// 需要滑动的元素
			duration : 200,					// 滑动的过度时间
			sub_menu_node : 'ul',			// 是否有相应的子元素，以便通过这个来判断是不需要滑动
			obj_class : 'active'			// 为所点击的元素增加一个标识
		}
		var opts = $.extend({}, defaults, opts);

		var opts_parents 			= 		opts.parents;
		var opts_slider 			= 		opts.slider;
		var opts_duration 			= 		opts.duration;
		var opts_sub_menu_node 		= 		opts.sub_menu_node;
		var opts_obj_class 			= 		opts.obj_class;

		var index = 0;

		return this.each(function(){
			var _this = $(this);
			var _that = this;

			_this.on('click', function(e){
				var has_list 		= 	_this.parent().find(opts_sub_menu_node);
				var _parents 		= 	_this.parents(opts_parents);
				var _slider 		= 	_this.parents(opts_slider);
				var _slider_width 	= 	_parents.width();
				var current_index 	= 	0;

				if(has_list.length){
					index++;
					var current_index = index;
					_this.next().show();
					$(opts_parents).find('a.active').removeClass(opts_obj_class);
					animate();
				} else if(_this.hasClass('back')){
					index--;
					var current_index = index;
					animate();
				} else {
					_this.addClass(opts_obj_class);
					return true;
				}

				function animate(){
					var scroll_left = -current_index * _slider_width;
					_slider.stop(true, true).animate({
						'left' : scroll_left + 'px'
					}, opts_duration);
				}
				return false;
			});
		});
	}
})(jQuery, document);

;;;(function(window, document){

	/**
	 * 全局命名空间
	 * author: johnchen@tag-along.org
	 * @type {Object}
	 */
	if(!window.utils) window.utils = {}

	/**
	 * 获取事件目标
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	var getTarget = function(e){
		if(!e) return false;
		var target = e.target || e.srcElement;
		return target;
	}
	window.utils.getTarget = getTarget;

	/**
	 * json对象转换成字符串
	 * @param  {[type]} json [description]
	 * @return {[type]}   [description]
	 */
	var jsonToString = function(json) {
		var array = [];
		var format = function(s) {
			if (typeof s == 'object' && s != null) return jsonToString(s);
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
		}
		for (var i in json) array.push("'" + i + "':" + format(json[i]));
		return '{' + array.join(',') + '}';
	}
	window.utils.jsonToString = jsonToString;

})(window, document);

$(function(){

	/**
	 * 匹配宽屏
	 * @param  {[type]} w [description]
	 * @return {[type]}   [description]
	 */
	if($.browser.msie){
		;;;(function(w){
			if(w.screen.availWidth >= 1200){
				document.body.className = 'widescreen';
			}
		})(window);
	}
});