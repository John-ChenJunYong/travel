$(function() {

    function c(){
	    if ($.browser.msie) {
            
			var w = $(window).width();
			if(w >= 1200){
		        $('html').removeClass('html_width_1000');
		        $('html').addClass('html_width_1200');

				//设置cookie，保存状态
			    $.cookie("html_width_css", 'html_width_1200', { expires: 7, path:'/' });
			}
			else{
		        $('html').removeClass('html_width_1200');
		        $('html').addClass('html_width_1000');

				//设置cookie，保存状态
			    $.cookie("html_width_css", 'html_width_1000', { expires: 7, path:'/' });
			}
	    }
	}

	c();
	$(window).resize(c);

	//IE9及以下，placeholder的处理
	//如：
	//<div class="input-password">
	//  <input type="password" name="password" placeholder="请输入密码">
	//</div>
	if($.browser.msie &&  $.browser.version <= 9){
		$("input[placeholder]").each(function(){

			var el = $(this);
			//文本框
			if(this.type == 'text' || this.type == 'textarea'){
				
				if(this.value == ''){
					el.val(el.attr('placeholder'));
				}
				
				el.focus(function() {
					var self = $(this);
					if(this.value == self.attr('placeholder')) {
						self.val('');
					}
				});

				el.click(function() {
					var self = $(this);
					if(this.value == self.attr('placeholder')) {
						self.val('');
					}
				});
				
				el.blur(function() {
					var self = $(this);
					if(this.value == '') {
						self.val(self.attr('placeholder'));
					}
				});
			}
			//密码框
			//由于value方式不能显示，只能在上方添加一个span
			else if(this.type == 'password'){

				//添加span
				var holder = $(this).data("holderspan");
				if((typeof holder) == 'undefined'){

					var h = $(this).outerHeight() +"px";

					var span = $("<span></span>");
					span.css({height:h,lineHeight:h});
					span.click(function(){
						$(this).hide();
						$(this).parent().find("input[type='password']").focus();
					});

					$(this).data("holderspan",span);

					$(this).parent().append(span);

					holder = span;
				}

                //赋值
				if(this.value == ''){
					if(holder){
						holder.show().html(el.attr('placeholder'));
					}
				}
				
				el.focus(function() {
					holder.hide().html('');
				});

				el.click(function() {
					holder.hide().html('');
				});
				
				el.blur(function() {
					var self = $(this);
					if(this.value == '') {

						var h = $(this).outerHeight() +"px";
						span.css({height:h,lineHeight:h});

						holder.show().html(self.attr('placeholder'));
					}
				});

			}

		});
	}
}); 