FullscreenWindow = function(div){
	
	this.fullscreens = [];	
	this.zIndex = 10000;
	this.margin = 20;

	this.frameContainer = function(onClose){
		var fs = this;
		var content = $("<div/>");
		content.addClass("blockContent");
		var closeButton = $("<div/>");
		closeButton.addClass("closeFullscreeen");
		content.append(closeButton);
		closeButton.click(function(){
		    if( onClose ){
		        onClose();
		    }			
		    fs.removeFullscreen();
		});
		return content;    
	}

	this.contentFullscreen = function(dialog,onClose,contentDiv){

		var content = this.frameContainer(onClose);
		$(content).append(contentDiv);

		this.addFullscreen(content);
				
	}
	
	this.loaderFullscreen = function(onclose){
		var container = this.frameContainer(onclose);
    		var content = $("<div/>");
		$(container).append(content);
		content.css('position','absolute');
		content.append("<div class='loader'/>");
//		content.append("<img src='images/ajax-loader.gif'/>");
		var fs = this.addFullscreen(content);
		if( typeof onclose != 'undefined' ){
	    		var close = $("<div/>").appendTo(fs.overlay);
			close.addClass('closeLoader');
			close.click(function(){
				onclose();
			});			
		}
	}

	this.downloadFullscreen = function(url){
	   var content = this.frameContainer();
   		var contentDiv = $("<div/>").appendTo(content);
		contentDiv.css('margin',this.margin+'px');
		contentDiv.css('width',($(div).width()-5*this.margin)+'px');
		contentDiv.css('font-family','Arial');
		var file = url.substring(url.lastIndexOf("/")+1);		
		contentDiv.append( "<h2 style='text-align:center;'>" + Util.getString('downloadHeader') + "</h2>" );
		contentDiv.append( "<p style='text-align:center;'>" + file + "</p>" );
		var save;
		var browser = BrowserDetect.browser;
		if( browser == "Chrome" || browser == "Firefox" || browser == "Safari" || browser == "Opera" || browser == "Explorer" ){
		      save = Util.getString('downloadSave') + " <strong>" + Util.getString(browser+'Download') + "</strong>";
		}
		else {
		      save = Util.getString('DefaultDownload');
		}
		contentDiv.append( "<p>1. <strong>" + Util.getString('save') + "</strong>: <br>" + save + "</p>" );
	  	var downloadCenter = "<a href='"+url+"'><div class='teiThumbnail'/></a>";
		contentDiv.append("<p style='text-align:center;'>"+downloadCenter+"</p>");
		var open = Util.getString('open');
		var open2 = Util.getString('downloadOpen');
		var link = "<a href='"+url+"' target='_blank'>" + Util.getString('here') + "</a>";
		contentDiv.append( "<p>2. <strong>" + open + "</strong>: <br>" + open2 + " <strong>" + link + "</strong> ...</p>" );
		this.addFullscreen(content);
	}

	this.getBounds = function(){
		var w, h;
		if( div == 'body' ){
			w = $(document).width();
			h = $(document).height();
		}
		else {
			w = $(div).outerWidth();
			h = $(div).outerHeight();
		}
		var paddingX = parseInt($(div).css('padding-left'))+parseInt($(div).css('padding-right'));
		var paddingY = parseInt($(div).css('padding-top'))+parseInt($(div).css('padding-bottom'));
		return {
			width: w-paddingX,
			height: h-paddingY
		};
	}

    this.addFullscreen = function(content){
		var blockDiv = $("<div/>").appendTo(div);
		blockDiv.addClass("blockDiv");
		var bounds = this.getBounds();
		blockDiv.css('width',bounds.width+'px');
		blockDiv.css('height',bounds.height+'px');
		blockDiv.css('z-index',++this.zIndex);
		blockDiv.css('top',parseInt($(div).css('padding-top'))+'px');
		var overlay = $("<div/>").appendTo(blockDiv);
		overlay.addClass("blockDivOverlay");
		overlay.css('width',bounds.width+'px');
		overlay.css('height',bounds.height+'px');
		$(content).appendTo(blockDiv);
		this.fullscreens.push({
		      content: content,
		      overlay: overlay,
		      blockDiv: blockDiv
        });
        this.centerDiv(content);
	return this.fullscreens[this.fullscreens.length-1];
    }
    
    this.centerDiv = function(content){
	var bounds = this.getBounds();
	var border = parseInt($(content).css('borderLeftWidth'));
        var left = Math.floor(bounds.width/2-content.width()/2) - border;
        var top = Math.floor(bounds.height/2-content.height()/2) - border;
		content.css('top', top+'px');
		content.css('left', left+'px');
    }
	
	this.removeFullscreen = function(){
		if( this.fullscreens.length > 0 ){
			$(this.fullscreens[this.fullscreens.length-1].blockDiv).remove();
			this.fullscreens.pop();
		}
	}
	
	this.resize = function(){
return;
	   for( var i in this.fullscreens ){
            this.fullscreens[i].blockDiv.css('width',$(document).width()+'px');
            this.fullscreens[i].blockDiv.css('height',$(document).height()+'px');
            this.fullscreens[i].overlay.css('width',$(document).width()+'px');
            this.fullscreens[i].overlay.css('height',$(document).height()+'px');
            this.centerDiv(this.fullscreens[i].content);
	   }
	}
	
}
