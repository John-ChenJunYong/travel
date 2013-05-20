//
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

