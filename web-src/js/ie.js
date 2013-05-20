$(function() {

    function c(){
	    if ($.browser.msie) {
            
			var w = $(window).width();
			if(w >= 1200){
		        $('html').removeClass('html_width_1000');
		        $('html').addClass('html_width_1200');

				//����cookie������״̬
			    $.cookie("html_width_css", 'html_width_1200', { expires: 7, path:'/' });
			}
			else{
		        $('html').removeClass('html_width_1200');
		        $('html').addClass('html_width_1000');

				//����cookie������״̬
			    $.cookie("html_width_css", 'html_width_1000', { expires: 7, path:'/' });
			}
	    }
	}

	c();
	$(window).resize(c);

	//IE9�����£�placeholder�Ĵ���
	//�磺
	//<div class="input-password">
	//  <input type="password" name="password" placeholder="����������">
	//</div>
	if($.browser.msie &&  $.browser.version <= 9){
		$("input[placeholder]").each(function(){

			var el = $(this);
			//�ı���
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
			//�����
			//����value��ʽ������ʾ��ֻ�����Ϸ����һ��span
			else if(this.type == 'password'){

				//���span
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

                //��ֵ
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