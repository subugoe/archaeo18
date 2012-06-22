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

		$(this.content).css('width',a18Props.hyperlinkWindowWidth+'px');
		$(this.content).css('height',a18Props.hyperlinkWindowHeight+'px');

		this.fullscreen = new FullscreenWindow(this.content);
		this.fullscreen.loaderFullscreen();

		this.hyperlinkWindow = $('<object type="text/html" data="'+url+'" width="'+a18Props.hyperlinkWindowWidth+'" height="'+a18Props.hyperlinkWindowHeight+'"/>');
		this.hyperlinkWindow.css('z-index',this.fullscreen.zIndex+1);
		this.hyperlinkWindow.css('position','absolute');
		$(this.content).append(this.hyperlinkWindow);
				
		this.label = $("<h4/>").appendTo(this.toolbarDiv);
		$(this.label).html(label);

		this.resizeIFrame = function(){
			this.hyperlinkWindow.css('width',$(this.content).width()+'px');
			this.hyperlinkWindow.css('height',$(this.content).height()+'px');
		};
				
};
