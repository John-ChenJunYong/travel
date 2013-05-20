/*## html js handler ##*/
if(!window.xhtml){
  (function($) {
    var _xhtml = xhtml = window.xhtml =  {
	    _Url: function(/*_xhtml._Url|String...*/){
		    // summary: 
		    //		Constructor to create an object representing a URL.
		    //		It is marked as private, since we might consider removing
		    //		or simplifying it.
		    // description: 
		    //		Each argument is evaluated in order relative to the next until
		    //		a canonical uri is produced. To get an absolute Uri relative to
		    //		the current document use:
		    //      	new _xhtml._Url(document.baseURI, url)

	        var ore = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),
		        ire = new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");

		    var n = null,
			    _a = arguments,
			    uri = [_a[0]];
		    // resolve uri components relative to each other
		    for(var i = 1; i<_a.length; i++){
			    if(!_a[i]){ continue; }

			    // Safari doesn't support this.constructor so we have to be explicit
			    // FIXME: Tracked (and fixed) in Webkit bug 3537.
			    //		http://bugs.webkit.org/show_bug.cgi?id=3537
			    var relobj = new _xhtml._Url(_a[i]+""),
			    	uriobj = new _xhtml._Url(uri[0]+"");

			    if(
			    	relobj.path == "" &&
				    !relobj.scheme &&
				    !relobj.authority &&
				    !relobj.query
			    ){
			    	if(relobj.fragment != n){
				    	uriobj.fragment = relobj.fragment;
			    	}
			    	relobj = uriobj;
			    }else if(!relobj.scheme){
			    	relobj.scheme = uriobj.scheme;

			    	if(!relobj.authority){
				    	relobj.authority = uriobj.authority;

				    	if(relobj.path.charAt(0) != "/"){
					    	var path = uriobj.path.substring(0,
						    	uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						    var segs = path.split("/");
						    for(var j = 0; j < segs.length; j++){
						    	if(segs[j] == "."){
						    		// flatten "./" references
						    		if(j == segs.length - 1){
							    		segs[j] = "";
								    }else{
								    	segs.splice(j, 1);
								    	j--;
						    		}
						    	}else if(j > 0 && !(j == 1 && segs[0] == "") &&
						    		segs[j] == ".." && segs[j-1] != ".."){
						    		// flatten "../" references
						    		if(j == (segs.length - 1)){
								    	segs.splice(j, 1);
								    	segs[j - 1] = "";
								    }else{
								    	segs.splice(j - 1, 2);
							    		j -= 2;
							    	}
						    	}
				    		}
				    		relobj.path = segs.join("/");
				    	}
			    	}
		    	}

		    	uri = [];
		    	if(relobj.scheme){ 
		    		uri.push(relobj.scheme, ":");
		    	}
			    if(relobj.authority){
			    	uri.push("//", relobj.authority);
			    }
			    uri.push(relobj.path);
			    if(relobj.query){
			    	uri.push("?", relobj.query);
			    }
			    if(relobj.fragment){
			    	uri.push("#", relobj.fragment);
			    }
		    }

		    this.uri = uri.join("");

		    // break the uri into its main components
		    var r = this.uri.match(ore);

		    this.scheme = r[2] || (r[1] ? "" : n);
		    this.authority = r[4] || (r[3] ? "" : n);
		    this.path = r[5]; // can never be undefined
		    this.query = r[7] || (r[6] ? "" : n);
		    this.fragment  = r[9] || (r[8] ? "" : n);

		    if(this.authority != n){
			    // server based naming authority
			    r = this.authority.match(ire);

			    this.user = r[3] || n;
			    this.password = r[4] || n;
			    this.host = r[6] || r[7]; // ipv6 || ipv4
			    this.port = r[9] || n;
		    }
	    }
	};

	_xhtml._Url.prototype.toString = function(){ return this.uri; };

	_xhtml._getText = function(href){
		var r;
		$.ajax({
			url: href,
			async: false,
			success: function(code){
				r = code;
			},
			error:function(e){
				var ext = href.match(/.*\.(\w+)/)[1];
				switch(ext.toLowerCase()){
					case 'css':
				        console.error('Error downloading remote css in "'+href+'".Please try this format:<link href="css.css" rel="stylesheet"\/>');
			            break;
					case 'js':
	 				    console.error('Error downloading remote script in "'+href+'".');
					    break;
					default:
	 				    console.error('Error downloading remote file in "'+href+'".');
					    break;
				}
			}
		});
		return r;
	};

  _xhtml.html = {

	 adjustCssPaths: function(cssUrl, cssText){
		//	summary:
		//		adjusts relative paths in cssText to be relative to cssUrl
		//		a path is considered relative if it doesn't start with '/' and not contains ':'
		//	description:
		//		Say we fetch a HTML page from level1/page.html
		//		It has some inline CSS:
		//			@import "css/page.css" tv, screen;
		//			...
		//			background-image: url(images/aplhaimage.png);
		//
		//		as we fetched this HTML and therefore this CSS
		//		from level1/page.html, these paths needs to be adjusted to:
		//			@import 'level1/css/page.css' tv, screen;
		//			...
		//			background-image: url(level1/images/alphaimage.png);
		//		
		//		In IE it will also adjust relative paths in AlphaImageLoader()
		//			filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/alphaimage.png');
		//		will be adjusted to:
		//			filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='level1/images/alphaimage.png');
		//
		//		Please note that any relative paths in AlphaImageLoader in external css files wont work, as
		//		the paths in AlphaImageLoader is MUST be declared relative to the HTML page,
		//		not relative to the CSS file that declares it

		if(!cssText || !cssUrl){ return; }

		// support the ImageAlphaFilter if it exists, most people use it in IE 6 for transparent PNGs
		// We are NOT going to kill it in IE 7 just because the PNGs work there. Somebody might have
		// other uses for it.
		// If user want to disable css filter in IE6  he/she should
		// unset filter in a declaration that just IE 6 doesn't understands
		// like * > .myselector { filter:none; }
		if($.browser.msie){
		    var alphaImageLoader = /(AlphaImageLoader\([^)]*?src=(['"]))(?![a-z]+:|\/)([^\r\n;}]+?)(\2[^)]*\)\s*[;}]?)/g;
			cssText = cssText.replace(alphaImageLoader, function(ignore, pre, delim, url, post){
				return pre + (new _xhtml._Url(cssUrl, './'+url).toString()) + post;
			});
		}

	    var cssPaths = /(?:(?:@import\s*(['"])(?![a-z]+:|\/)([^\r\n;{]+?)\1)|url\(\s*(['"]?)(?![a-z]+:|\/)([^\r\n;]+?)\3\s*\))([a-z, \s]*[;}]?)/g;

		return cssText.replace(cssPaths, function(ignore, delimStr, strUrl, delimUrl, urlUrl, media){
			if(strUrl){
				return '@import "' + (new _xhtml._Url(cssUrl, './'+strUrl).toString()) + '"' + media;
			}else{
				return 'url(' + (new _xhtml._Url(cssUrl, './'+urlUrl).toString()) + ')' + media;
			}
		});
	},

	adjustHtmlPaths: function(htmlUrl, cont){
		var url = htmlUrl || "./";

	    // attributepaths one tag can have multiple paths, example:
	    // <input src="..." style="url(..)"/> or <a style="url(..)" href="..">
	    // <img style='filter:progid...AlphaImageLoader(src="noticeTheSrcHereRunsThroughHtmlSrc")' src="img">
	    var htmlAttrPaths = /(<[a-z][a-z0-9]*\s[^>]*)(?:(href|src)=(['"]?)([^>]*?)\3|style=(['"]?)([^>]*?)\5)([^>]*>)/gi;

		return cont.replace(htmlAttrPaths,
			function(tag, start, name, delim, relUrl, delim2, cssText, end){
				return start + (name ?
							(name + '=' + delim + (new _xhtml._Url(url, relUrl).toString()) + delim)
						: ('style=' + delim2 + _xhtml.html.adjustCssPaths(url, cssText) + delim2)
				) + end;
			}
		);
	},
	
	snarfStyles: function	(/*String*/cssUrl, /*String*/cont, /*Array*/styles){
		/****************  cut out all <style> and <link rel="stylesheet" href=".."> **************/
		// also return any attributes from this tag (might be a media attribute)
		// if cssUrl is set it will adjust paths accordingly
		styles.attributes = [];

		return cont.replace(/(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi,
			function(ignore, styleAttr, cssText, linkAttr, delim, href){
				// trim attribute
				var i, attr = (styleAttr||linkAttr||"").replace(/^\s*([\s\S]*?)\s*$/i, "$1"); 
				if(cssText){
					i = styles.push(cssUrl ? _xhtml.html.adjustCssPaths(cssUrl, cssText) : cssText);
				}else{
					var _t = this;

					var gtext = _xhtml._getText(href);

					if(gtext){
					    i = styles.push(gtext);
					}
					else{
						_xhtml.html.appendRemoteCSS(href);
					}

					attr = attr.replace(/\s*(?:rel|href)=(['"])?[^\s]*\1\s*/gi, ""); // remove rel=... and href=...
				}
				if(attr){
					attr = attr.split(/\s+/);// split on both "\n", "\t", " " etc
					var atObj = {}, tmp;
					for(var j = 0, e = attr.length; j < e; j++){
						tmp = attr[j].split('='); // split name='value'
						atObj[tmp[0]] = tmp[1].replace(/^\s*['"]?([\s\S]*?)['"]?\s*$/, "$1"); // trim and remove ''
					}
					styles.attributes[i - 1] = atObj;
				}
				return ""; // squelsh the <style> or <link>
			}
		);
	},

	snarfScripts: function(cont, byRef){
		// summary
		//		strips out script tags from cont

		//Update script tags nested in comments so that the script tag collector doesn't pick
		//them up.
		cont = cont.replace(/<[!][-][-](.|\s){5,}?[-][-]>/g,
			function(comment){
				return comment.replace(/<(\/?)script\b/ig,"&lt;$1Script");
			}
		);
		
		// match <script>, <script type="text/...
		return cont.replace(/<script\s*(?![^>]*type=['"]?(?:ed\/|text\/html\b))(?:[^>]*?(?:src=(['"]?)([^>]*?)\1[^>]*)?)*>([\s\S]*?)<\/script>/gi,
			function(ignore, delim, src, code){
				if(src){
			        src = src.replace(/&([a-z0-9#]+);/g, function(m, name) {
			        	switch(name) {
			        		case "amp"	: return "&";
			        		case "gt"	: return ">";
			        		case "lt"	: return "<";
			        		default:
			        			return name.charAt(0)=="#" ? String.fromCharCode(name.substring(1)) : "&"+name+";";
			        	}
			        });

					var gtext = _xhtml._getText(src);

					if(gtext){
					    byRef.code += gtext +";";
					}
					else{
						_xhtml.html.appendRemoteJS(src);
					}
				}else{
					byRef.code += code;
				}
				return "";
			}
		);
	}, 
	
	evalInGlobal: function(code, appendNode){
		// we do our own eval here as _xhtml.eval doesn't eval in global crossbrowser
		// This work X browser but but it relies on a DOM
		// plus it doesn't return anything, thats unrelevant here but not for ed core
		if(code){
			code = code.replace(/_container_(?!\s*=[^=])/g, "$('#"+appendNode.getAttribute('id')+"')");

		    appendNode = appendNode || document.body;
		    var n = appendNode.ownerDocument.createElement('script');
		    n.type = "text/javascript";
		    appendNode.appendChild(n);
		    n.text = code; // DOM 1 says this should work
		}
	},

    remoteUrls: {},
	appendRemoteJS: function(href){
		var st, doc = document, appendNode = document.getElementsByTagName('head')[0];

		var s = _xhtml.html.remoteUrls[href];
		if(!s){

             st = document.createElement('script');
             st.setAttribute("type","text/javascript");
             st.setAttribute("src", href);

		     appendNode.appendChild(st); // must insert into DOM before setting cssText

			 _xhtml.html.remoteUrls[href] = true;
		}
	},

	appendRemoteCSS: function(href){
		var st, doc = document, appendNode = document.getElementsByTagName('head')[0];

		if(!_xhtml.html.remoteUrls[href]){

            st = document.createElement("link");
            st.setAttribute("rel", "stylesheet");
            st.setAttribute("type", "text/css");
            st.setAttribute("href", href);

		    appendNode.appendChild(st); // must insert into DOM before setting cssText
			
			_xhtml.html.remoteUrls[href] = true;
		}
	},


	renderStyles: function(styles, appendNode){
			var st, att, cssText, doc = document;

			for(var i = 0, e = styles.length; i < e; i++){
				cssText = styles[i]; att = styles.attributes[i];
				st = doc.createElement('style');
				st.setAttribute("type", "text/css"); // this is required in CSS spec!

				for(var x in att){
					st.setAttribute(x, att[x]);
				}

				appendNode.appendChild(st); // must insert into DOM before setting cssText

				if(st.styleSheet){ // IE
					st.styleSheet.cssText = cssText;
				}else{ // w3c
					st.appendChild(doc.createTextNode(cssText));
				}
			}
	}
  };

	xhtml["eval"] = function(/*String*/ scriptFragment){
		return window.eval ? window.eval(scriptFragment) : eval(scriptFragment); 	// Object
	};

  })(jQuery); // Call and execute the function immediately passing the jQuery object
}


