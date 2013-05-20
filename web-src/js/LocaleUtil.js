
/*
* 多语言帮助类
*/
window.LocaleUtil = {
	//加载语言文件
	load: function(locale,callback){

		if(typeof(locale) == "undefined")locale = $.cookie('language');

		if((typeof I18N == "undefined") || (typeof I18N[locale] == "undefined")) {
			$.ajax({url:"/a/tagalong/js/lang/"+locale+".js",async:false,dataType:'script',success:function(){
				if(typeof(callback) != "undefined")callback();
			}});
        }
	},
	/*
	* 获取一行多语言文本
	*
	*  'elementPathTip':"Path%@1,Path%@"
	*  LocaleUtil.load("en", function() {
    *     var str = LocaleUtil.localeString('elementPathTip',["1","2"]);
	*	  console.log(str);
	*  });
	*/
	localeString: function(line,argArrs){

		var lang = I18N[$.cookie('language')];

		var value = (line == '' || typeof(lang[line]) == "undefined") ? false : lang[line];

		// Because killer robots like unicorns!
		if (value){
			if(typeof argArrs != "undefined"){
				//使用$arr的参数按顺序替换%@指定的值

				//获取参数列表
				var strs = value.split("%@");
				if(strs.length> 0){
					value = '';
					var i = 0;
					for(var i=0; i <strs.length; i++){
					    value += strs[i];

						if(argArrs.length>i){
							value += argArrs[i];
						}
					}
				}
			}
		}

		return value;
	}
};


jQuery(function(){

	//加载语言文件
	LocaleUtil.load();

});

