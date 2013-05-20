
/*
* �����԰�����
*/
window.LocaleUtil = {
	//���������ļ�
	load: function(locale,callback){

		if(typeof(locale) == "undefined")locale = $.cookie('language');

		if((typeof I18N == "undefined") || (typeof I18N[locale] == "undefined")) {
			$.ajax({url:"/a/tagalong/js/lang/"+locale+".js",async:false,dataType:'script',success:function(){
				if(typeof(callback) != "undefined")callback();
			}});
        }
	},
	/*
	* ��ȡһ�ж������ı�
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
				//ʹ��$arr�Ĳ�����˳���滻%@ָ����ֵ

				//��ȡ�����б�
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

	//���������ļ�
	LocaleUtil.load();

});

/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number'){ data.to(option);}
      else if (action){ data[action]();}
      else if (options.interval){ data.pause().cycle();}
    })
  }

  $.fn.carousel.defaults = {
    interval: 7000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);//
// Modal Class

function Modal(element, options) {
    
    this.options = jQuery.extend({}, Modal.DEFAULTS, options || {});

    this.modal = jQuery(options.modal ? Modal.WRAPPER_MODAL : Modal.WRAPPER_MODAL);
	this.modal.attr('id',options.id);
    jQuery.data(this.modal[0], 'modal', this);
    
    this.visible = false;

	//触发的节点
	if(this.options.fromNode){
		this.fromNode = this.options.fromNode;
	}
    
    if (this.options.modal) {
        this.options = jQuery.extend(this.options, {center: true, draggable: false});
    }
    
    // options.actuator == DOM element that opened this modal
    // association will be automatically deleted when this modal is remove()d
    if (this.options.actuator) {
        jQuery.data(this.options.actuator, 'active.modal', this);
    }
    
    this.setContent(element || "<div></div>");
	this._setupLoader();
	this._setupCloser();
    this._setupTitleBar();
    
    this.modal.css('display', 'none').appendTo(document.body);
	this.modal.css('margin', '0');
	this.modal.css('width', 'auto');
    this.toTop();

    if (this.options.fixed) {
        if (jQuery.browser.msie && jQuery.browser.version < 7) {
            this.options.fixed = false; // IE6 doesn't support fixed positioning
        } else {
            this.modal.addClass('fixed');
        }
    }
    
    if (this.options.center && Modal._u(this.options.x, this.options.y)) {
        this.center();
    } else {
        this.moveTo(
            !Modal._u(this.options.x) ? this.options.x : Modal.DEFAULT_X,
            !Modal._u(this.options.y) ? this.options.y : Modal.DEFAULT_Y
        );
    }

    if (this.options.show) this.show();
};

Modal.EF = function() {};
Modal._ajaxcaches = {};

jQuery.extend(Modal, {
    
    WRAPPER:    "<table cellspacing='0' cellpadding='0' border='0' class='modal-wrapper'>" +
                "<tr><td class='top-left'></td><td class='top'></td><td class='top-right'></td></tr>" +
                "<tr><td class='left'></td><td class='modal-container'><div class='modal-inner'></div></td><td class='right'></td></tr>" +
                "<tr><td class='bottom-left'></td><td class='bottom'></td><td class='bottom-right'></td></tr>" +
                "</table>",

    WRAPPER_MODAL:    '"<div class="modal hide fade modal-wrapper">' +
                "<div class='modal-container'><div class='modal-inner'></div></div>" +
                "</div>",
    
    DEFAULTS: {
        title:                  null,           // titlebar text. titlebar will not be visible if not set.
        closeable:              true,           // display close link in titlebar?
		showCloseIcon:          true,
        draggable:              true,           // can this dialog be dragged?
        clone:                  false,          // clone content prior to insertion into dialog?
        actuator:               null,           // element which opened this dialog
        center:                 true,           // center dialog in viewport?
        show:                   true,           // show dialog immediately?
        modal:                  false,          // make dialog modal?
        fixed:                  true,           // use fixed positioning, if supported? absolute positioning used otherwise
        closeText:              '',      // text to use for default close link
		loader:                 true,           // the loader
        unloadOnHide:           false,          // should this dialog be removed from the DOM after being hidden?
		clickToClose:           false,          // Click the modal background to close the box
        behaviours:             Modal.EF,        // function used to apply behaviours to all content embedded in dialog.
        afterDrop:              Modal.EF,        // callback fired after dialog is dropped. executes in context of Modal instance.
        afterShow:              Modal.EF,        // callback fired after dialog becomes visible. executes in context of Modal instance.
        afterHide:              Modal.EF,        // callback fired after dialog is hidden. executed in context of Modal instance.
        beforeUnload:           Modal.EF,         // callback fired after dialog is unloaded. executed in context of Modal instance.
		afterLoad:              Modal.EF,         // callback fired after dialog is unloaded. executed in context of Modal instance.
		cache:                  true,
		hideFade:               false,
        hideShrink:             'vertical',
		fromNode:               false             //触发Modal的原始节点，例如一个button
    },
    
	IE6:                (jQuery.browser.msie && jQuery.browser.version < 7),
    DEFAULT_X:          50,
    DEFAULT_Y:          50,
    MODAL_OPACITY:      0.7,
    zIndex:             1337,
    dragConfigured:     false, // only set up one drag handler for all modals
    resizeConfigured:   false,
    dragging:           null,
    
    // load a URL and display in modal
    // url - url to load
    // options keys (any not listed below are passed to modal constructor)
    //   type: HTTP method, default: GET
    //   cache: cache retrieved content? default: false
    //   filter: jQuery selector used to filter remote content
    load: function(url, options) {
        
        options = options || {};

	    //检查id
	    var div_id = '';
	    if(!div_id){
	    	div_id = options.id;
	    }
	    if(!div_id){
	    	div_id = ''+new Date().getTime();
	    }
		options.id = div_id;

		if(Modal._ajaxcaches[url]){
			var html = Modal._ajaxcaches[url];

			var styles=[], byRef={code:''},xh = xhtml.html;

			//替换id
			html = html.replace(/_self_/g, '#'+options.id);

			html = xh.adjustHtmlPaths(".", html);
			html = xh.snarfStyles(".", html, styles);

			html = xh.snarfScripts(html, byRef);

			html = html.replace(/(<!\[CDATA\[|\]\]>)/g, '');

			// $(node).find('.modal-inner').html(html);
			var node = $(html);
			if (options.filter) node = jQuery(options.filter, node);
			var box = new Modal(node, options);

			xh.renderStyles(styles,node[0]);
            xh.evalInGlobal(byRef.code,node[0]);

			box._fire('afterLoad');

			return box;
		}
		else{
			var dh = $(document).height();
			var dw = $(document).width();

		    var box = new Modal($("<div></div>"), options);
			box.getLoader().show();
        
            jQuery.get(url,null,function(html) {

					if(options.cache)Modal._ajaxcaches[url] = html;

			        var styles=[], byRef={code:''},xh = xhtml.html;

			        //替换id
			        html = html.replace(/_self_/g, '#'+options.id);

			        html = xh.adjustHtmlPaths(".", html);
			        html = xh.snarfStyles(".", html, styles);

			        html = xh.snarfScripts(html, byRef);

			        html = html.replace(/(<!\[CDATA\[|\]\]>)/g, '');

			       // $(node).find('.modal-inner').html(html);
			       var node = $(html);

			       xh.renderStyles(styles,node[0]);
                   xh.evalInGlobal(byRef.code,node[0]);

			       if (options.filter) node = jQuery(options.filter, node);
			       box.setContent(node);

			       box.getLoader().hide();

				   var size = box.getSize();
				   //box.modal.css({width: size[0]+20});

  		           if (options.center && Modal._u(options.x, options.y)) {
  		               box.center();
  		           } else {
					   var bw = size[0]+20,bh = size[1];

					   var pos = box.getPosition();
					   var x = pos[0],y = pos[1];

					   if(x < 0)x = 0;
					   if(x >= dw -bw)x = dw -bw - 20;

			           if(y < 0)y = 0;
			           if(y >= dh -bh)y = dh -bh - 20;

  		               box.moveTo(
  		                   x,
  		                   y
  		               );
  		           }

				   box._fire('afterLoad');
                },'html');
			return box;
		}
    },

	loadImage: function(url, options) {
        var img = new Image();
        img.onload = function() {
            new Modal($('<div class="modal-image-wrapper"/>').append(this), options);
        };
        img.src = url;
    },
    
    // allows you to get a handle to the containing modal instance of any element
    // e.g. <a href='#' onclick='alert(Modal.get(this));'>inspect!</a>.
    // this returns the actual instance of the modal 'class', not just a DOM element.
    // Modal.get(this).hide() would be valid, for instance.
    get: function(ele) {
        var p = jQuery(ele).parents('.modal-wrapper');
        return p.length ? jQuery.data(p[0], 'modal') : null;
    },
    
    // returns the modal instance which has been linked to a given element via the
    // 'actuator' constructor option.
    linkedTo: function(ele) {
        return jQuery.data(ele, 'active.modal');
    },
    
    // displays an alert box with a given message, calling optional callback
    // after dismissal.
    alert: function(message, callback, options) {
        return Modal.ask(message, [LocaleUtil.localeString('Modal_ok')], callback, options);
    },
    
    // displays an alert box with a given message, calling after callback iff
    // user selects OK.
    confirm: function(message, after, options) {
		var ok = LocaleUtil.localeString('Modal_ok');
		var cancel = LocaleUtil.localeString('Modal_cancel');
        return Modal.ask(message, [ok, cancel], function(response) {
            if (response == ok && after) after();
        }, options);
    },
    
    // asks a question with multiple responses presented as buttons
    // selected item is returned to a callback method.
    // answers may be either an array or a hash. if it's an array, the
    // the callback will received the selected value. if it's a hash,
    // you'll get the corresponding key.
    ask: function(question, answers, callback, options) {
        
        options = jQuery.extend({modal: true, closeable: false},
                                options || {},
                                {show: true, unloadOnHide: true});


	    var div = '<div class="confirm">'+
				  '<div class="modal-body">'+
				  '</div>'+
				  '<div class="modal-footer">'+
				  '</div></div>';

        
        var body = jQuery(div);
		body.find('.modal-body').html(question);
        
        // ick
        var map = {}, answerStrings = [];
        if (answers instanceof Array) {
            for (var i = 0; i < answers.length; i++) {
                map[answers[i]] = answers[i];
                answerStrings.push(answers[i]);
            }
        } else {
            for (var k in answers) {
                map[answers[k]] = k;
                answerStrings.push(answers[k]);
            }
        }
        
        var buttons = body.find('.modal-footer');
		var i = 0;
		var css = '';
        buttons.html(jQuery.map(answerStrings, function(v) {
			css = (i == 0) ? ' btn-primary' : '';
			i++;
            return "<button class='btn"+ css +"' type='button'>" + v + "</button>";
        }).join(' '));
        
        jQuery('button', buttons).click(function() {
            var clicked = this;
            Modal.get(this).hide(function() {
                if (callback) callback(map[$(clicked).html()]);
            });
        });
        
        var box = new Modal(body, options);
        box.getLoader().hide();
    },
    
    // returns true if a modal modal is visible, false otherwise
    isModalVisible: function() {
        return jQuery('.modal-modal-blackout').length > 0;
    },
    
    _u: function() {
        for (var i = 0; i < arguments.length; i++)
            if (typeof arguments[i] != 'undefined') return false;
        return true;
    },

    _values: function(t) {
        if (t instanceof Array) return t;
        var o = [];
        for (var k in t) o.push(t[k]);
        return o;
    },
    
    _handleResize: function(evt) {
        var d = jQuery(document);
        jQuery('.modal-modal-blackout').css('display', 'none').css({
            width: d.width(), height: d.height()
        }).css('display', 'block');
    },
    
    _handleDrag: function(evt) {
        var d;
        if (d = Modal.dragging) {
            d[0].modal.css({left: evt.pageX - d[1], top: evt.pageY - d[2]});
        }
    },
    
    _nextZ: function() {
        return Modal.zIndex++;
    },
    
    _viewport: function() {
        var d = document.documentElement, b = document.body, w = window;
        return jQuery.extend(
            jQuery.browser.msie ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset },
            !Modal._u(w.innerWidth) ?
                { width: w.innerWidth, height: w.innerHeight } :
                (!Modal._u(d) && !Modal._u(d.clientWidth) && d.clientWidth != 0 ?
                    { width: d.clientWidth, height: d.clientHeight } :
                    { width: b.clientWidth, height: b.clientHeight }) );
    },
    
    _setupModalResizing: function() {
        if (!Modal.resizeConfigured) {
            var w = jQuery(window).resize(Modal._handleResize);
            if (Modal.IE6) w.scroll(Modal._handleResize);
            Modal.resizeConfigured = true;
        }
    },
    
    _cssForOverlay: function() {
        if (Modal.IE6) {
            return Modal._viewport();
        } else {
            return {width: jQuery(document).width(), height: jQuery(document).height()};
        }
    }

});

Modal.prototype = {
    
    // Returns the size of this modal instance without displaying it.
    // Do not use this method if modal is already visible, use getSize() instead.
    estimateSize: function() {
        this.modal.css({visibility: 'hidden', display: 'block'});
        var dims = this.getSize();
        this.modal.css('display', 'none').css('visibility', 'visible');
        return dims;
    },
                
    // Returns the dimensions of the entire modal dialog as [width,height]
    getSize: function() {
        return [this.modal.width(), this.modal.height()];
    },
    
    // Returns the dimensions of the content region as [width,height]
    getContentSize: function() {
        var c = this.getContent();
        return [c.width(), c.height()];
    },
    
    // Returns the position of this dialog as [x,y]
    getPosition: function() {
        var b = this.modal[0];
        return [b.offsetLeft, b.offsetTop];
    },
    
    // Returns the center point of this dialog as [x,y]
    getCenter: function() {
        var p = this.getPosition();
        var s = this.getSize();
        return [Math.floor(p[0] + s[0] / 2), Math.floor(p[1] + s[1] / 2)];
    },
                
    // Returns a jQuery object wrapping the inner modal region.
    // Not much reason to use this, you're probably more interested in getContent()
    getInner: function() {
        return jQuery('.modal-inner', this.modal);
    },
    
    // Returns a jQuery object wrapping the modal content region.
    // This is the user-editable content area (i.e. excludes titlebar)
    getContent: function() {
        return jQuery('.modal-content', this.modal);
    },
    
    // Replace dialog content
    setContent: function(newContent) {
        newContent = jQuery(newContent).css({display: 'block'}).addClass('modal-content');
        if (this.options.clone) newContent = newContent.clone(true);
        this.getContent().remove();
        this.getInner().append(newContent);
        this._setupDefaultBehaviours(newContent);
        this.options.behaviours.call(this, newContent);

        return this;
    },
    
    // Move this dialog to some position, funnily enough
    moveTo: function(x, y) {
        this.moveToX(x).moveToY(y);
        return this;
    },
    
    // Move this dialog (x-coord only)
    moveToX: function(x) {
        if (typeof x == 'number'){
			var dw = $(document).width();
			var bw = this.getSize()[0];

			if(x < 0)x = 0;
			if(x >= dw -bw)x = dw -bw - 20;
			this.modal.css({left: x});
		}
        else this.centerX();
        return this;
    },
    
    // Move this dialog (y-coord only)
    moveToY: function(y) {
        if (typeof y == 'number'){
			var dh = $(document).height();
			var bh = this.getSize()[1];

			if(y < 0)y = 0;
			if(y >= dh -bh)y = dh -bh - 20;
			this.modal.css({top: y});
		}
        else this.centerY();
        return this;
    },
    
    // Move this dialog so that it is centered at (x,y)
    centerAt: function(x, y) {
        var s = this[this.visible ? 'getSize' : 'estimateSize']();
        if (typeof x == 'number') this.moveToX(x - s[0] / 2);
        if (typeof y == 'number') this.moveToY(y - s[1] / 2);
        return this;
    },
    
    centerAtX: function(x) {
        return this.centerAt(x, null);
    },
    
    centerAtY: function(y) {
        return this.centerAt(null, y);
    },
    
    // Center this dialog in the viewport
    // axis is optional, can be 'x', 'y'.
    center: function(axis) {
        var v = Modal._viewport();
        var o = this.options.fixed ? [0, 0] : [v.left, v.top];
        if (!axis || axis == 'x') this.centerAt(o[0] + v.width / 2, null);
        if (!axis || axis == 'y') this.centerAt(null, o[1] + v.height / 2);
        return this;
    },
    
    // Center this dialog in the viewport (x-coord only)
    centerX: function() {
        return this.center('x');
    },
    
    // Center this dialog in the viewport (y-coord only)
    centerY: function() {
        return this.center('y');
    },
    
    // Resize the content region to a specific size
    resize: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        this.modal.css({left: bounds[0], top: bounds[1]});
        this.getContent().css({width: bounds[2], height: bounds[3]});
        if (after) after(this);
        return this;
    },
    
    // Tween the content region to a specific size
    tween: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        var self = this;
        this.modal.stop().animate({left: bounds[0], top: bounds[1]});
        this.getContent().stop().animate({width: bounds[2], height: bounds[3]}, function() {
            if (after) after(self);
        });
        return this;
    },
    
    // Returns true if this dialog is visible, false otherwise
    isVisible: function() {
        return this.visible;    
    },
    
    // Make this modal instance visible
    show: function() {
        if (this.visible) return;
        if (this.options.modal) {
            var self = this;
            Modal._setupModalResizing();
            this.modalBlackout = jQuery('<div class="modal-modal-blackout"></div>')
                .css(jQuery.extend(Modal._cssForOverlay(), {
                    zIndex: Modal._nextZ(), opacity: Modal.MODAL_OPACITY
                })).appendTo(document.body);
			this.modalBlackout.bgiframe(); 
            this.toTop();

            if (this.options.clickToClose) {
				this.modalBlackout.click(function() { 
                     self.hide();                  
                });
			}

        }
		this.getInner().stop().css({width: '', height: ''});
        this.modal.stop().css({opacity: 1}).show();
        this.visible = true;
		this.modal.find('.close:first').focus();
        this._fire('afterShow');
        return this;
    },
    
    // Hide this modal instance
    hide: function(after) {
        if (!this.visible) return;
        var self = this;
        var target = { modal: {}, inner: {} },
			tween = 0,
			hideComplete = function() {
				self.modal.css({display: 'none'});
				self.visible = false;
				self._fire('afterHide');
				if (after) after(self);
				if (self.options.unloadOnHide) self.unload();
				self.modal.remove();
			};
		
		if (this.options.hideShrink) {
			var inner = this.getInner(), hs = this.options.hideShrink, pos = this.getPosition();
			tween |= 1;
			if (hs === true || hs == 'vertical') {
				target.inner.height = 0;
				target.modal.top = pos[1] + inner.height() / 2;
			}
			if (hs === true || hs == 'horizontal') {
				target.inner.width = 0;
				target.modal.left = pos[0] + inner.width() / 2;
			}
		}
		
		if (this.options.hideFade) {
			tween |= 2;
			target.modal.opacity = 0;
		}
		
		if (tween) {
			if (tween & 1) inner.stop().animate(target.inner, 300);
			this.modal.stop().animate(target.modal, 300, hideComplete);
		} else {
			hideComplete();
		}

        if (this.options.modal) {
             this.modalBlackout.remove();
        }
		
		return this;
    },
    
    toggle: function() {
        this[this.visible ? 'hide' : 'show']();
        return this;
    },
    
    hideAndUnload: function(after) {
        this.options.unloadOnHide = true;
        this.hide(after);
        return this;
    },
    
    unload: function() {
        this._fire('beforeUnload');
        this.modal.remove();
        if (this.options.actuator) {
            jQuery.data(this.options.actuator, 'active.modal', false);
        }
    },
    
    // Move this dialog box above all other modal instances
    toTop: function() {
        this.modal.css({zIndex: Modal._nextZ()});
        return this;
    },
    
    // Returns the title of this dialog
    getTitle: function() {
        return jQuery('> .title-bar h2', this.getInner()).html();
    },
    
    // Sets the title of this dialog
    setTitle: function(t) {
        jQuery('> .title-bar h2', this.getInner()).html(t);
        return this;
    },

    
    // Returns the Loader of this dialog
    getLoader: function() {
        return $('> .content-loader', this.getInner());
    },    
    //
    // Don't touch these privates
    
    _getBoundsForResize: function(width, height) {
        var csize = this.getContentSize();
        var delta = [width - csize[0], height - csize[1]];
        var p = this.getPosition();
        return [Math.max(p[0] - delta[0] / 2, 0),
                Math.max(p[1] - delta[1] / 2, 0), width, height];
    },
    
    _setupTitleBar: function() {
        if (this.options.title) {
            var self = this;
            var tb = jQuery("<div class='title-bar'></div>").html("<h2>" + this.options.title + "</h2>");
            if (this.options.draggable) {
                tb[0].onselectstart = function() { return false; }
                tb[0].unselectable = 'on';
                tb[0].style.MozUserSelect = 'none';
                if (!Modal.dragConfigured) {
                    jQuery(document).mousemove(Modal._handleDrag);
                    Modal.dragConfigured = true;
                }
                tb.mousedown(function(evt) {
                    self.toTop();
                    Modal.dragging = [self, evt.pageX - self.modal[0].offsetLeft, evt.pageY - self.modal[0].offsetTop];
                    jQuery(this).addClass('dragging');
                }).mouseup(function() {
                    jQuery(this).removeClass('dragging');
                    Modal.dragging = null;
                    self._fire('afterDrop');
                });
            }
            this.getInner().prepend(tb);
            this._setupDefaultBehaviours(tb);
        }
    },
    _setupCloser: function() {
        if (this.options.closeable && this.options.showCloseIcon/* && !(this.options.clickToClose && this.options.center)*/) {
            var self = this;
            var tb = jQuery("<div class='closeicon close'></div>").html(this.options.closeText);

            this.getInner().prepend(tb);
			tb.mousedown(function(evt) { evt.stopPropagation(); });
			tb.click(function(event) {
				
                self.hide();

				event.preventDefault();
            });

        }
    },
	_setupLoader: function(){
        if (this.options.loader) {
            var self = this;
            var tb = jQuery("<div class='content-loader'></div>");
            if (this.options.draggable) {
                tb[0].onselectstart = function() { return false; }
                tb[0].unselectable = 'on';
                tb[0].style.MozUserSelect = 'none';
                tb.mousedown(function(evt) {
                    self.toTop();
                });
            }
            this.getInner().prepend(tb);
        }
	},
    
    _setupDefaultBehaviours: function(root) {
        var self = this;
        jQuery('.closemodal', root).click(function() {
            self.hide();
            return false;
        }).mousedown(function(evt) { evt.stopPropagation(); });
    },
    
    _fire: function(event) {
        this.options[event].call(this);
    },
	timeToHide: function(d,num){
		var self = this;
		var timer = null;
		var i = num ? num : 0;
		if(d){
			d = $(d);
			timer = setInterval(function(){
				d.html(i);
				if(i==0){
					self.hide();
					clearTimeout(timer);
				}
				i--;
			},1000);
		}
	}
    
};

/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-22 01:45:56 +0200 (Son, 22 Jul 2007) $
 * $Rev: 2447 $
 *
 * Version 2.1.1
 */
(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);/*## html js handler ##*/
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


/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', '.dropdown-menu form', function (e) { e.stopPropagation() })
	.on('click.dropdown.data-api', '.dropdown-menu input', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
    .on('click.dropdown.data-api', clearMenus)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);/* =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
	}

	// Picker object

	var Datepicker = function(element, options) {
		var that = this;

		this.element = $(element);
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'yyyy/mm/dd');
		this.picker = $(DPGlobal.template)
							.appendTo('body')
							.on({
								click: $.proxy(this.click, this)
							});
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if(this.component && this.component.length === 0)
			this.component = false;

		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				keyup: $.proxy(this.update, this),
				keydown: $.proxy(this.keydown, this)
			});
		} else {
			if (this.component && this.hasInput){
				// For components that are not readonly, allow keyboard nav
				this.element.find('input').on({
					focus: $.proxy(this.show, this),
					keyup: $.proxy(this.update, this),
					keydown: $.proxy(this.keydown, this)
				});

				this.component.on('click', $.proxy(this.show, this));
			} else {
				this.element.on('click', $.proxy(this.show, this));
			}
		}

		$(document).on('mousedown', function (e) {
			// Clicked outside the datepicker, hide it
			if ($(e.target).closest('.datepicker').length == 0) {
				that.hide();
			}
		});

		this.autoclose = true;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		switch(options.startView || this.element.data('date-start-view')){
			case 2:
			case 'decade':
				this.viewMode = this.startViewMode = 2;
				break;
			case 1:
			case 'year':
				this.viewMode = this.startViewMode = 1;
				break;
			case 0:
			case 'month':
			default:
				this.viewMode = this.startViewMode = 0;
				break;
		}

		this.todayHighlight = (options.todayHighlight||this.element.data('date-today-highlight')||false);

		this.weekStart = ((options.weekStart||this.element.data('date-weekstart')||dates.weekStart||0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.onRender = options.onRender;
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.setStartDate(options.startDate||this.element.data('date-startdate'));
		this.setEndDate(options.endDate||this.element.data('date-enddate'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.update();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function(e){
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			if (e && e.currentTarget.value)
				this.setValue();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		getDate: function() {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset()*60000))
		},

		getUTCDate: function() {
			return this.date;
		},

		setDate: function(d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
		},

		setUTCDate: function(d) {
			this.date = d;
			this.setValue();
		},

		setValue: function() {
			var formatted = DPGlobal.formatDate(this.date, this.format);
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.prop('value', formatted);
			}
		},

		setStartDate: function(startDate){
			this.startDate = startDate||-Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this.endDate = endDate||Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format);
			}
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			var zIndex = parseInt(this.element.parents().filter(function() {
							return $(this).css('z-index') != 'auto';
						}).first().css('z-index'))+100;
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left,
				zIndex: zIndex
			});
		},

		update: function(){
			this.date = DPGlobal.parseDate(
				this.isInput ? this.element.prop('value') : this.element.data('date') || this.element.find('input').prop('value'),
				this.format
			);
			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart;
			var html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+dates.daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '';
			var i = 0
			while (i < 12) {
				html += '<span class="month">'+dates.monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = this.date.valueOf(),
				today = new Date();
			this.picker.find('.datepicker-days thead th:eq(1)')
						.text(year+'年'+dates.months[month]);
			this.picker.find('tfoot th.today')
						.html(dates.today);
			this.picker.find('tfoot th.clear')
						.html(dates.clear);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = this.onRender(prevMonth);
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if (prevMonth.valueOf() < this.startDate || prevMonth.valueOf() > this.endDate) {
					clsName += ' disabled';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getUTCFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length == 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date.setUTCHours(0);
								date.setUTCMinutes(0);
								date.setUTCSeconds(0);
								date.setUTCMilliseconds(0);

								this.showMode(-2);
								//If true, the "Today" button will only move the current date into view; if "linked", the current date will also be selected.
								//var which = this.todayBtn == 'linked' ? null : 'view';
								this._setDate(date, null);
								break;
							case 'clear':
								this._clearDate();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							this.viewDate.setUTCDate(1);
							if (target.is('.month')) {
								var month = target.parent().find('span').index(target);
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
							} else {
								var year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10)||1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth();
							if (target.is('.old')) {
								if (month == 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day,0,0,0,0));
						}
						break;
				}
			}
		},

		_setDate: function(date, which){
			if (!which || which == 'date')
				this.date = date;
			if (!which || which  == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose) {
									this.hide();
				}
			}
		},

		_clearDate: function(){
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.val('');
				element.change();
				if (this.autoclose) {
									this.hide();
				}
			}
		},

		moveMonth: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getUTCMonth() != new_month; };
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){ return new_month != new_date.getUTCMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged){
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.updateNavArrows();
		}
	};

	$.fn.datepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.datepicker.defaults = {
		onRender: function(date) {
			return '';
		}
	};
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
			days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
			daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			monthsShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
			today:'今天',
			clear:'清除'
	}

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		validParts: /dd?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length == 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format) {
			if (date instanceof Date) return date;
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){ return d.setUTCFullYear(v); },
					yy: function(d,v){ return d.setUTCFullYear(2000+v); },
					m: function(d,v){
						v -= 1;
						while (v<0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){ return d.setUTCDate(v); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			if (parts.length == format.parts.length) {
				for (var i=0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = format.parts[i];
					if (isNaN(val)) {
						switch(part) {
							case 'MM':
								filtered = $(dates.months).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates.months) + 1;
								break;
							case 'M':
								filtered = $(dates.monthsShort).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates.monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i=0, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed)
						setters_map[s](date, parsed[s])
				}
			}
			return date;
		},
		formatDate: function(date, format){
			var val = {
				d: date.getUTCDate(),
				m: date.getUTCMonth() + 1,
				M: dates.monthsShort[date.getUTCMonth()],
				MM: dates.months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length)
					date.push(seps.shift())
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev"><i class="icon-arrow-left"/></th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next"><i class="icon-arrow-right"/></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="3" class="today"></th><th colspan="1"></th><th colspan="3" class="clear"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datepicker dropdown-menu">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';
}( window.jQuery );
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
			//����value��ʽ������ʾ��ֻ�����Ϸ�����һ��span
			else if(this.type == 'password'){

				//����span
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
}); (function($) {
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

$(function(){

	$(".topbar .top-lang .dropdown-menu li").click(function(){
		var lang = $(this).data('lang');
		$.cookie('language', lang, { expires: 30, path: '/' });
		window.location.reload();
	});


	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

	var datepicker = $(".carousel-search-date").datepicker({
		onRender: function(date) {
		    return date.valueOf() < now.valueOf() ? 'disabled' : '';
		}
    }).data('datepicker');
	if(datepicker.picker){
	    datepicker.picker.addClass("datepicker-no-arrow");
	}

	var datepicker = $(".topbar-search-date").datepicker({
		onRender: function(date) {
		    return date.valueOf() < now.valueOf() ? 'disabled' : '';
		}
    }).data('datepicker');
	if(datepicker.picker){
	    datepicker.picker.addClass("datepicker-no-arrow");
	}

	Comm.googlePlace($('.topbar-search-city')[0]);

	$('.topbar-search-city').focus(function(){
		$('.pac-container').css('z-index', 9999);
	});

	$('.topbar-partner-circle').click(function(){
		$(this).toggleClass('active');
		$('.topbar-partner-list').toggle();
	});


    //�����Ĵ���
	$(".simpleform").simpleForm();

});/*
* ͨ�õ�JS��
*/
window.Comm = {
	//��ʼ��Google Place��������
	googlePlace: function(input){
		if (window.google) {
		    var autocomplete = new google.maps.places.Autocomplete(input, {types: ["geocode"]});
		}
	}
};
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
                //����������
				var top_domain=["aero","asia","biz","cat","com","coop","info","int","jobs","mobi","museum","name","net","org","pro","tel","travel","xxx","edu","gov","mil"];
		        var nation_domain=["ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sk", "sl", "sm", "sn", "so", "sr", "ss", "st", "sv", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "za", "zm", "zw"];

				var url = document.location.hostname;
				var arr = url.split('.');

				var len= arr.length;
				var root_domain = '';

				if(len >1){
					var last = arr[len-1];//���һ��

            		if($.inArray(last,top_domain)){
						//�Զ�����������
             		   root_domain = arr[len-2] + "." + last;
            		}
					else if($.inArray(last,nation_domain)){
						//���Թ�����������
						var sencond = arr[len-2];

						if($.inArray(sencond,top_domain)){
							//�ڶ����������ҵ�,��Ҫ��һ���ֶ�
                  		  root_domain = sencond + "." + last;
							if(len >2){
                   		     root_domain = arr[len-3] + "." + root_domain;
							}
						}
						else{
							//�ҵ�
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

