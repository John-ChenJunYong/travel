/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0




jquery.cookie
A simple, lightweight jQuery plugin for reading, writing and deleting cookies.

Installation
Include script after the jQuery library (unless you are packaging scripts somehow else):

<script src="/path/to/jquery.cookie.js"></script>
Usage
Create session cookie:

$.cookie('the_cookie', 'the_value');
Create expiring cookie, 7 days from then:

$.cookie('the_cookie', 'the_value', { expires: 7 });
Create expiring cookie, valid across entire page:

$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
Read cookie:

$.cookie('the_cookie'); // => 'the_value'
$.cookie('not_existing'); // => null
Delete cookie by passing null as value:

$.cookie('the_cookie', null);
Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie.

Options
expires: 365
Define lifetime of the cookie. Value can be a Number (which will be interpreted as days from time of creation) or a Date object. If omitted, the cookie is a session cookie.

path: '/'
Default: path of page where the cookie was created.

Define the path where cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire page use path: '/'.

domain: 'example.com'
Default: domain of page where the cookie was created.

secure: true
Default: false. If true, the cookie transmission requires a secure protocol (https).

raw: true
Default: false.

By default the cookie is encoded/decoded when creating/reading, using encodeURIComponent/decodeURIComponent. Turn off by setting raw: true.
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

			if(!(options && options.domain)){
                //处理根域名
				var top_domain=["aero","asia","biz","cat","com","coop","info","int","jobs","mobi","museum","name","net","org","pro","tel","travel","xxx","edu","gov","mil"];
		        var nation_domain=["ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sk", "sl", "sm", "sn", "so", "sr", "ss", "st", "sv", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "za", "zm", "zw"];

				var url = document.location.hostname;
				var arr = url.split('.');

				var len= arr.length;
				var root_domain = '';

				if(len >1){
					var last = arr[len-1];//最后一个

            		if($.inArray(last,top_domain)){
						//以顶级域名结束
             		   root_domain = arr[len-2] + "." + last;
            		}
					else if($.inArray(last,nation_domain)){
						//若以国家域名结束
						var sencond = arr[len-2];

						if($.inArray(sencond,top_domain)){
							//在顶级域名中找到,需要下一个字段
                  		  root_domain = sencond + "." + last;
							if(len >2){
                   		     root_domain = arr[len-3] + "." + root_domain;
							}
						}
						else{
							//找到
                  		  root_domain = sencond + "." + last;
						}
					}
				}

				if(root_domain != ''){
					//options.domain = "." + root_domain;
					options.domain = root_domain;
				}
			}

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

