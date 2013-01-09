/**
* window to open a hyperlink (e.g. getty)
*/
HyperlinkWindow = function(url,label){

		var frame = this;
		var window = $('<div/>').appendTo(a18Gui.containerDiv);
		$.extend(window,new FrameWindow('window','clearfix'));
		window.initializeFrame({
			draggable: a18Props.draggable,
			resizable: true,
			concealable: a18Props.concealable,
			removable: a18Props.removable,
			triggerResize: function(){ frame.resizeIFrame(); }
		});
		window.setWindowFunctionality(true);

		$.extend(this,window);

		$(this).css('width',a18Props.hyperlinkWindowWidth+'px');
		$(this.content).css('width',a18Props.hyperlinkWindowWidth+'px');
		$(this.content).css('height',a18Props.hyperlinkWindowHeight+'px');

		this.fullscreen = new FullscreenWindow(this.content);
		this.fullscreen.loaderFullscreen();

		this.hyperlinkWindow = $('<object type="text/html" data="'+url+'" width="'+a18Props.hyperlinkWindowWidth+'" height="'+a18Props.hyperlinkWindowHeight+'"/>');
		this.hyperlinkWindow.css('z-index',this.fullscreen.zIndex+1);
		this.hyperlinkWindow.css('position','absolute');
		$(this.content).append(this.hyperlinkWindow);
		var resizeHandles = $('.ui-resizable-handle',frame);
		for( var i=0; i<resizeHandles.length; i++ ){
			$(resizeHandles[i]).css('z-index',this.fullscreen.zIndex+2);
		}
				
		this.setLabel(label);

		this.resizeIFrame = function(){
			frame.fullscreen.removeFullscreen();
			$(frame.content).css('width',$(frame).width()+'px');
			this.hyperlinkWindow.css('width',$(frame.content).width()+'px');
			this.hyperlinkWindow.css('height',$(frame.content).height()+'px');
		};
				
};
