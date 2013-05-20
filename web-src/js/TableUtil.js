
//对列表中的内容进行排序
window.TableUtil = {
    up: function(d,url){
		var d = $(d);
		if(d.css('visibility') != 'hidden'){

			var p = d.parent().parent();
			//上一个节点
			var prev = p.prevAll(":visible").first();

			//上一个节点的data-id
			var did = prev.attr('data-id');

			 //更新sort
			 $.post(url,{type:'up',did:did},function(result){
				 if(result == 'ok'){

					prev.before(p);

					TableUtil.adjustCss(p.parent());
				 }
				 else{
					 Modal.alert(result);
				 }
			 });
		}
	},
    down: function(d,url){
		var d = $(d);
		if(d.css('visibility') != 'hidden'){

			var p = d.parent().parent();
			//下一个节点
			var next = p.nextAll(":visible").first();

			//下一个节点的data-id
			var did = next.attr('data-id');

			 //更新sort
			 $.post(url,{type:'down',did:did},function(result){
				 if(result == 'ok'){
					
					//移动节点
					next.after(p);

					TableUtil.adjustCss(p.parent());
				 }
				 else{
					 Modal.alert(result);
				 }
			 });
		}
	},
	del: function(d,url,hasSort){
		var d = $(d);

		Modal.confirm(LocaleUtil.localeString('TableUtil_to_del'),function(){

			 //删除
			 $.post(url,{type:'del'},function(result){
				 if(result == 'ok'){
					var p = $(d).parent().parent();

					//tbody
					var tbody = p.parent();
					p.remove();

					//页面中有排序，更新箭头
					if(hasSort)TableUtil.adjustCss(tbody);
				 }
				 else{
					 Modal.alert(result);
				 }
			 });
		});
	},
	//此处的filter仅用于静态过滤，需要动态过滤请自定义filter()函数
	filter: function(k, d){
		if(!d)d = '.table-striped';
		if(k){
		    $(d + ' tbody tr').hide().filter(":contains('"+k+"')").show(100);
		}
		else{
		    $(d + ' tbody tr').show(500);
		}

		TableUtil.adjustCss($(d).find('tbody'));

		//处理无数据的显示
		TableUtil.adjustNone($(d));
	},
	//动态筛选页面的处理
	// is_dialog: 是否打开窗口，  
	//            true:在此情况下，会从返回的结果中过滤掉其他代码，只返回与d相同的部分用于替换
	//            false:在此情况下，返回的代码全部置于d中间
	query: function(url,d,is_dialog){
		if(!d)d = '#list';
		if(url){
			$.ajax({url: url, type: 'GET', dataType: 'html', cache: false, success: function(html) {
				var content = '';
				if(is_dialog){
					var tmp_div = $(html).find(d);
					content = tmp_div.html();
					tmp_div.remove();
				}
				else{
					content = html;
				}
				$(d).html(content);

                //处理无数据的显示
				TableUtil.adjustNone($(d).find('table'));

			},error:function(xhr, status){
				if(status==404){
					Modal.alert(LocaleUtil.localeString('TableUtil_404'));
				}
				else if(status != "error"){
					Modal.alert(LocaleUtil.localeString('TableUtil_500'));
				}
			}});
		}
	},
	pager: function(func,pageNo){
		var func = eval(func);
		if(func){
			func(pageNo);
		}
	},
	adjustCss: function(tbody){

		//处理sort-arrow-none
		var visible_tr = $(tbody).find('tr:visible');
		if(visible_tr.length == 1){
			$(tbody).find('tr .sort-arrow-up').addClass('sort-arrow-none');
			$(tbody).find('tr .sort-arrow-down').addClass('sort-arrow-none');
		}
		else{
			$(tbody).find('tr .sort-arrow-none').removeClass('sort-arrow-none');
			visible_tr.first().find('.sort-arrow-up').addClass('sort-arrow-none');
			visible_tr.last().find('.sort-arrow-down').addClass('sort-arrow-none');
		}
	},
	adjustNone: function(table){
		if(!table)table = $('table.table-bordered');

		var tbody = table.find('tbody');
		var visible_tr = tbody.find('tr:visible');
		if(visible_tr.length == 0){
			table.find('tr.table-none').show();
		}
		else{
			table.find('tr.table-none').hide();
		}
	},
	//确认是否需要执行，执行后状态变为disabled
	//需要在button标签中使用
	ajax: function(d,url){
		var d = $(d);
		Modal.load(url, {modal:true,fixed:true,clickToClose:true,showCloseIcon:false,center:true,fromNode:d});
	},
	//切换状态
	//需要在button中使用，button中的文本从label1\label2中轮流切换
	// label1 : on   label2: off
	// 服务器中进行切换的处理，如上传的status为1，则要切换为0
	toggle: function(d,label1,label2,url){
		var d = $(d);

		var title = LocaleUtil.localeString('TableUtil_toggle',[d.html()]);

		var status = (d.html() == label1) ? '1' : '0';
		Modal.confirm(title,function(){

			 //删除
			 $.post(url,{status:status},function(result){
				 if(result == 'ok'){
					 if(status == '1'){
						 d.html(label2);
					 }
					 else{
						 d.html(label1);
					 }
				 }
				 else{
					 Modal.alert(result);
				 }
			 });
		});
	}
};

