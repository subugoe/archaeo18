FrameWindow = function(frameClass,headerClass){

	this.windowFunctionality = true;

	this.initializeFrame = function(params){

		this.params = params;

		var frame = this;
//		this.addClass("frame passiveFrame");
		this.addClass("frame");
		this.addClass(frameClass);
		this.visibility = true;

		this.toolbarDiv = $("<div/>").appendTo(this);
		this.toolbarDiv.addClass(headerClass);
		this.label = $("<div/>").appendTo(this.toolbarDiv);
		
/*
		this.label = $("<div/>").appendTo(this.toolbarDiv);
		this.label.addClass("label");
*/

		this.windowTools = $("<ul class='windowtools'/>").appendTo(this.toolbarDiv);
//		this.windowTools.addClass("windowTools");

		this.content = $("<div/>").appendTo(this);
		$(this.content).css('position','relative');
		$(this.content).mousedown(function(){
			frame.updateZIndex(false);
		});

		if( params.draggable ){
			this.mousedown(function(evt){
				if( frame.windowFunctionality ){
					frame.dragFrame(evt);
				}
			});
			$(this.content).bind('mousedown',function(e){
				e.stopPropagation();
			});
		}
		
		if( params.concealable ){
			this.visibilityButton = $("<li/>").appendTo(this.windowTools);
			this.visibilityLink = $('<a class="button-minimize"><span class="visuallyhidden"/>&nbsp;</a>').appendTo(this.visibilityButton);
			this.visibilityLink.attr("title",Util.getString('minimizeWindow'));
			this.visibilityButton.click(function(){
				frame.toggleVisibility();
			});
		}

		if( params.removable ){
			this.removeButton = $("<li/>").appendTo(this.windowTools);
			var removeLink = $('<a class="button-close"/>').appendTo(this.removeButton);
//			$('<span class="visuallyhidden"/>').appendTo(removeLink);
			removeLink.attr("title",Util.getString('removeWindow'));
			this.removeButton.click(function(){
				frame.toolbarDiv.remove();
				if( typeof params.triggerRemove != 'undefined' ){
					params.triggerRemove();
				}
				a18Gui.checkGrid();
				$(frame).remove();
			});
		}

		if( params.fullscreen ){
			var fullscreenLi = $('<li/>').appendTo(this.windowTools);
			var fullscreen = $('<a class="tools-maximize"/>').appendTo(fullscreenLi);
			fullscreen.attr('title',Util.getString('fullscreenMode'));
			var maximized = false;
			var w, h, l, t;
			fullscreen.click(function(){
				maximized = !maximized;
				var width, height, left, top;
				if( maximized ){
					w = $(frame).width();
					h = $(frame).height();
					t = $(frame).position().top;
					l = $(frame).position().left;
					var marginGap = a18Props.margin;
					width = $(a18Gui.containerDiv).width()-2*marginGap;
					height = $(a18Gui.containerDiv).height()-2*marginGap;
					left = marginGap;
					top = marginGap;
				}
				else {
					width = w;
					height = h;
					left = l;
					top = t;
				}
				frame.position(left,top);
				frame.setSize(width,height);
				frame.resize();
				frame.resizeContent();
			});
		}

		this.updateZIndex(true);

		$(this).mousedown(function(){
			frame.updateZIndex(false);
		});

	};

	this.updateZIndex = function(set){
		if( !set ){
			var zIndex = $(this).css('z-index');
			if( a18Gui.zIndex != zIndex ){
				set = true;
			}
		}
		if( set ){
			var z = a18Gui.getZIndex();
			$(this).css('z-index',z);
			if( typeof a18Gui.activeWindow != 'undefined' ){
//				a18Gui.activeWindow.removeClass('activeFrame');
//				a18Gui.activeWindow.addClass('passiveFrame');
			}
			a18Gui.activeWindow = this;
//			a18Gui.activeWindow.removeClass('passiveFrame');
//			a18Gui.activeWindow.addClass('activeFrame');
		}
	};
	
	this.setWindowFunctionality = function(windowFunctionality){
		this.windowFunctionality = windowFunctionality;
		this.setResizability(this.windowFunctionality);
	};

	this.setResizability = function(append){
		var frame = this;
		if( this.params.resizable && append && this.windowFunctionality && this.visibility ){
			$(this).resizable({
				resize: function() {
					frame.resize();
				},
				stop: function() {
					if( typeof frame.params.triggerResize != 'undefined' ){
						frame.params.triggerResize();
					}
				}
			});
			$('ui-resizable-handle').css('z-index','9999');
		}
		else if( this.params.resizable ){
			$(this).resizable('destroy');
		}
	};
		
	this.setSize = function(width,height){
		this.css('width', width+"px" );
		this.css('height',height+'px');
	};
	
	this.resize = function(){
		this.toolbarDiv.css('width',($(this).width())+'px');
	//	$(this.label).css('margin',Math.floor((this.toolbarDiv.height()-this.label.height())/2)+'px');
		var p = parseInt($(this).css("padding-top"))*2-4;
//		this.content.css('width', ($(this).width()-p)+"px");
		this.content.css('height', ($(this).height()-p-this.toolbarDiv.height())+"px");
	};
	
	this.position = function(left,top){
		this.css('left',left+'px');
		this.css('top',top+'px');
	};

	this.getPosition = function(){
		if( this.visibility ){
			return {
				t: $(this).position().top,
				l: $(this).position().left,
				w: $(this).width(),
				h: $(this).height()
			};
		}
		return {
			t: this.top,
			l: this.left,
			w: this.width,
			h: this.height
		};
	};
		
	this.toggleVisibility = function(){
		var frame = this;
		var padding = parseInt($(this).css("padding-top"));
		this.visibility = !this.visibility;		
		if( this.visibility ){
			this.visibilityLink.removeClass("button-open");
			this.visibilityLink.addClass("button-minimize");
			$(this).animate({
				height: "-="+($(frame).height()-frame.height),
				top: "-="+($(frame).position().top-frame.top),
				left: "-="+($(frame).position().left-frame.left),
				width: "-="+($(frame).width()-frame.width)
			  }, 500, function(){
					frame.resize();
					a18Gui.checkGrid();
			});
			this.setResizability(true);
		}
		else {
			this.top = $(this).position().top;
			this.left = $(this).position().left;
			this.width = $(this).width();
			this.height = $(this).height();
			this.visibilityLink.removeClass("button-minimize");
			this.visibilityLink.addClass("button-open");
			$(this).animate({
				height: "-="+($(frame).height()-$(frame.toolbarDiv).height()+5),
				top: "-="+(frame.top-10),
				left: "+="+(frame.width/2-(frame.label.width()+frame.windowTools.width()+20)/2),
			    	width: "-="+($(frame).width()-frame.label.width()-frame.windowTools.width()-20)
			  }, 500, function(){
					frame.resize();
					a18Gui.checkGrid();
			});
			this.setResizability(false);
		}
	};
	
	this.setLabel = function(label){
return;
		$(this.label).html(label);
		$(this.label).css('margin',Math.floor((this.toolbarDiv.height()-this.label.height())/2)+'px');
	};
	
	this.dragFrame = function(evt){
		var frame = this;
		var getMousePosition = function(e){
			if(!e){
		    	e = window.event;
			}
		    var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
		    return {
		    	top: e.pageY ? e.pageY : e.clientY,
		        left: e.pageX ? e.pageX : e.clientX
		    };
		}
		var startPos = getMousePosition(evt);
		var windowLeft = $(frame).position().left;
		var windowTop = $(frame).position().top;
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		document.onmousemove = function(e){
			var pos = getMousePosition(e);
			frame.css('left',(windowLeft+pos.left-startPos.left)+'px');
			frame.css('top',(windowTop+pos.top-startPos.top)+'px');
			a18Gui.checkHeight();
		}
	};
	
	this.isVisible = function(){
		return this.visibility;
	};

};
