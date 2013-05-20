(function($) {
    "use strict";

    /*
	*  表单验证类
	*  提示通过其后的em显示，定义em的css,并添加success,error
	*  pattern="email" empty="请填写电子邮箱" valid="true" unvalid="邮箱格式不正确" valid-css="good_input" unvalid-css="error_input"
	*  valid = true时显示状态，但无文本；valid=文本时，状态+文本
	*
	*/
	$.fn.simpleForm = function() {
        
        return this.each(function() {
            var $this = $(this);

            if(!$this.data('simpleform')){
                $this.data('simpleform', new $.SimpleForm(
                    $this
                ));
			}

        });
    };


	$.SimpleForm = function($elem) {

        if (!$elem || !($elem instanceof $) || $elem.length !== 1) {
            throw new Error('Invalid parameter for SimpleForm.');
        }

        /**
         * @constant Link to this instance
         * @type object
         * @private
         */
        var self = this;

        /**
         * Init DOM elements repository
         */
        this.dom = {};

        /**
         * Store the input element we're attached to in the repository
         */
        this.dom.$elem = $elem;


        $elem.find('input').blur(function(){
		    var d = $(this);
		    //self.validate(d);
			self.validateOnSubmit($elem,self);
	    });
        $elem.find('select').click(function(){
		    var d = $(this);
		    //self.validate(d);
			self.validateOnSubmit($elem,self);
	    });
		$elem.find('textarea').blur(function(){
		    var d = $(this);
		    //self.validate(d);
			self.validateOnSubmit($elem,self);
	    });


		$elem.submit(function(e){
			var onsubmit = $elem.attr('onsubmit');
			if(onsubmit){
				e.preventDefault();
			}

			var valid = self.validateOnSubmit($elem,self);

			//检查是否设置验证通过后的处理函数
			var onvalid = $elem.attr('onvalid');
			if(valid && onvalid){
                //清除IE9以下的placeholer
				self.clear_ie_placeholder($elem);

				valid = eval(onvalid);
				//不提交表单
				//valid = false;

			}
			else{
                //清除IE9及以下的placeholer
				self.clear_ie_placeholder($elem);
			}
			
		    return valid;
		});

	};

    //清除IE9及以下的placeholer
	$.SimpleForm.prototype.clear_ie_placeholder = function(d) {
		if(jQuery.browser.msie && jQuery.browser.version < 10){
			for(var i = 0; i < d[0].elements.length; i++)
			{
				var e = d[0].elements[i];
				var dd = $(e);
				var placeholder = dd.attr('placeholder');
				if(dd.val() == placeholder){
					dd.val('');
				}
			}
		}
	};


    $.SimpleForm.prototype.validate = function(d) {

		var passed = true;

		//是否存在em
		var em = d.nextAll('em');
		if(em.length==0){
			em = d.parent().nextAll('em');
			if(em.length==0){
				em = $('<em></em>');
				d.after(em);
			}
		}

		var empty = d.attr('empty');
		var valid = d.attr('valid');
		var unvalid = d.attr('unvalid');
		var pattern = d.attr('regex');
		if(!pattern) pattern = '';

		var valid_css = d.attr('valid-css');
		var unvalid_css = d.attr('unvalid-css');

		var placeholder = d.attr('placeholder');


		//input[radio checkbox]的处理
		var fieldType = d.prop("type");

		var value = d.val();
		if(value == '' || value == placeholder || fieldType == 'radio' || fieldType == 'checkbox' ){
			//空值处理
			var all_empty = true;

			//empty-group的处理
			var empty_group = d.attr('empty-group');
			if(empty_group){
				//逗号，分割处理
				var arr=empty_group.split(",");
				if(arr){
					//检查是否全部为空
					var atv;
					for(var i=0; i< arr.length; i++){
						if(arr[i] != ''){
							atv = $(arr[i]).val();
							if(atv != '' && atv != $(arr[i]).attr('placeholder')){
							    all_empty = false;
							}
						}
					}
				}
			}

			//input[radio checkbox]的处理
			if(fieldType == 'radio' || fieldType == 'checkbox'){
				var fieldName = d.prop("name");
				var fields = $("input[name='"+ fieldName +"']");
				for(var i=0; i< fields.length; i++){
					if($(fields[i]).attr('checked')){
						all_empty = false;
					}
				}
			}

		   	if(all_empty && empty){
				em.css({'display':'inline-block'}).html(empty);

				if(valid_css)d.removeClass(valid_css);
				if(unvalid_css)d.addClass(unvalid_css);
				passed = false;
			}
			else{
				if(valid){
					em.css({'display':'inline-block'}).html('');
					if(!(valid === true)){
					    em.html(valid);
					}
				}
				else{
					em.hide();
				}
				if(unvalid_css)d.removeClass(unvalid_css);
				if(valid_css)d.addClass(valid_css);
			}
		}
		else{

			//分析pattern，看看是否需要拆分为数组,以分号区隔

			//是否符合规范处理
			if(pattern.toLowerCase().indexOf('equalto:') == 0){
				//与某个input等值比较
				var equal_d = pattern.replace('equalto:','');
				if($(equal_d).val() != d.val()){
					passed = false;
				}
			}
			else if(pattern.toLowerCase().indexOf('func:') == 0){
				//执行函数判断
				var func_d = pattern.replace('func:','');
				var func_ret = eval(func_d + "()");
				if(!func_ret){
					passed = false;
				}
			}
			else if(pattern.toLowerCase().indexOf('ajax:') == 0){
				//与某个input等值比较
				var equal_d = pattern.replace('ajax:','');
				//if($(equal_d).val() != d.val()){
					passed = false;
				//}
			}
			else{

				switch(pattern)
				{
					case 'email': pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)+$/i;break;
					case 'qq':  pattern = /^[1-9][0-9]{4,}$/i;break;
					case 'id': pattern = /^\d{15}(\d{2}[0-9x])?$/i;break;
					case 'ip': pattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i;break;
					case 'zip': pattern = /^\d{6}$/i;break;
					case 'phone': pattern = /^((\d{3,4})|\d{3,4}-)?\d{7,8}(-\d+)*$/i;break;
					case 'mobile': pattern = /^1[3584]\d{9}$/i;break;
					case 'url': pattern = /^[a-zA-Z]+:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))+(\/?\S*)?$/i;break;
					case 'date': pattern = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/i;break;
					case 'datetime': pattern = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29) (?:(?:[0-1][0-9])|(?:2[0-3])):(?:[0-5][0-9]):(?:[0-5][0-9])$/i;break;
					case 'int':	pattern = /^\d+$/i;break;
					case 'float': pattern = /^\d+\.?\d*$/i;break;
					case 'username' : pattern = /^[a-z\d_\u4e00-\u9fa5\uf900-\ufa2d]{5,20}$/ig;break;
					case 'name' : pattern = /^[a-z\d\s_\u4e00-\u9fa5\uf900-\ufa2d]{5,50}$/ig;break;
					case 'pagename' :  pattern = /^[a-zA-Z]{1}[a-z\d_\-]{1,49}$/i;break;
					case 'password' : pattern = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;break;
				}

                //默认的规则
				if(pattern){
					if(!pattern.test){
						pattern = new RegExp(pattern,'g');
					}
				    passed = pattern.test(value);
				}
				//if(value.search(pattern) == -1){
			    //    passed = false;
				//}
			}

			if (!passed){
				em.css({'display':'inline-block'}).html(unvalid);

				if(valid_css)d.removeClass(valid_css);
				if(unvalid_css)d.addClass(unvalid_css);
			}
			else{
				if(valid){
					em.css({'display':'inline-block'}).html('');
					if(!(valid === true)){
					    em.html(valid);
					}
				}
				else{
					em.hide();
				}

				if(unvalid_css)d.removeClass(unvalid_css);
				if(valid_css)d.addClass(valid_css);
			}
		}
		return passed;
    };


    $.SimpleForm.prototype.validateOnSubmit = function(d,self) {
        var valid = true;
        for(var i = 0; i < d[0].elements.length; i++)
        {
            var e = d[0].elements[i];
			var dd = $(e);
			var forcevalidate = dd.attr('forcevalidate');
			if(forcevalidate)forcevalidate = eval("("+ forcevalidate +")");
            if (forcevalidate || (e.type == "text" || e.type == "password" || e.type == "select-one" || e.type == "textarea" || e.type == "radio" || e.type == "checkbox") && e.style.display!='none') {
				if(dd.is(":visible") && !dd.attr('disabled') || forcevalidate ){
		            if(!self.validate(dd)){
					    valid = false;
				    }
				}
			}
		}

		//if(!valid)alert('请把表单填写完整');
		return valid;
    };

})(jQuery);

