/*
* entity tooltip implementation
*/
var tooltip = new function(){
	  
	var options = {
		xOffset: 15,
		yOffset: 15,
		clickRemove: false,
		followMouse: true,
		content: ''
	};

	var activeTooltips = [];

	/*
	* avoids popup if parent tooltip is active (nested entities)
	*/
	this.isActive = function(parent){
		for( var i in activeTooltips ){
			if( activeTooltips[i].parent == parent ){
				return true;
			}
		}
		return false;
	}

	this.checkErase = function(){
		if( activeTooltips.length == 1 ){
			var tt = activeTooltips[0];
			if( ! ( tt.mouseOverParent || tt.mouseOverTooltip ) ){
				$(tt.tooltip).remove();
				activeTooltips.pop();
			}
		}
	}

	/*
	* tooltip for 'hover' mode (if link was hovered)
	*/
	if( a18Props.tooltipMode == 'hover' ){
		this.removeAllTooltips = function(){
			for( var i=activeTooltips.length; i>0; i-- ){
				$(activeTooltips[i-1].tooltip).remove();
				activeTooltips.pop();
			}
		};
		var checkActivity = function(){
			var check = true;
			while( check ){
				if( activeTooltips.length > 0 ){
					var activeTooltip = activeTooltips[ activeTooltips.length - 1 ];
					if( !activeTooltip.mouseOverParent && !activeTooltip.mouseOverTooltip ){
						$(activeTooltip.tooltip).remove();
						activeTooltips.pop();
					}
					else {
						check = false;
					}
				}
				else {
					check = false;
				}
			}
		}
		this.setTooltip = function(parent,content,trigger){
			var tt = this;
			$(parent).mouseenter(function(e){
				if( tt.isActive(parent) ){
					return;	
				}
				setTimeout(function(){ checkActivity(); },100);
				//checkActivity();
				if ( typeof content != 'undefined' ){
//					var tooltip = $("<div id='tooltipWindow'/>").appendTo('body');
					var tooltip = $("<div class='info'/>").appendTo(a18Gui.containerDiv);
					$(tooltip).css('z-index','99999');
					$(content).appendTo(tooltip);
					var activeTooltip = {
						tooltip: tooltip,
						parent: parent,
						mouseOverParent: true,
						mouseOverTooltip: false
					};
					activeTooltips.push(activeTooltip);
					tooltip.css("top",(e.pageY - tooltip.height() - $(a18Gui.containerDiv).offset().top) + "px");
					tooltip.css("left",(e.pageX) + "px");
					tooltip.fadeIn("fast");
		  			$(tooltip).hover(function(e){
		      				activeTooltip.mouseOverTooltip = true;
		  			},function(){	
		      				activeTooltip.mouseOverTooltip = false;
	  				});
		  			$(parent).hover(function(e){
		      				activeTooltip.mouseOverParent = true;
		  			},function(){	
		      				activeTooltip.mouseOverParent = false;
	  				});
					/*
					$(parent).mouseleave(function(e){
						activeTooltip.mouseOverParent = false;
					});
					*/
					if( trigger ){
						trigger(tooltip);
					}
				}
			});
		};
		$(window).mousemove(function(e){
			checkActivity();
	       	});
	}

	/*
	* tooltip for 'click' mode (if link was clicked)
	*/
	if( a18Props.tooltipMode == 'click' ){
		this.setTooltip = function(parent,content,trigger){
			$(parent).mouseenter(function(e){
				if ( typeof content != 'undefined' && content != '' ){			
					var tooltip = $("<div id='tooltipWindow'>"+ content +"</div>").appendTo('body');
					var activeTooltip = {
						tooltip: tooltip,
						parent: parent,
						clicked: false
					};
					tooltip.css("top",($(parent).offset().top + $(parent).height()) + "px");
					tooltip.css("left",($(parent).offset().left) + "px");
					tooltip.fadeIn("fast");
					$(parent).mouseleave(function(e){
						if(!activeTooltip.clicked){
							$(tooltip).remove();
						}
					});
					$(parent).click(function(e){
						activeTooltip.clicked = true;
						$(tooltip).draggable();
						var close = $('<div class="closeTooltip"/>').appendTo(tooltip);
						close.click(function(e){
							$(tooltip).remove();
						});
					});
					if( trigger ){
						trigger(tooltip);
					}
				}
			});
		};
	}
	  
}
