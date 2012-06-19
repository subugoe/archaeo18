/**
 * @class fullscreen
 * Implementation for fullscreen Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

var fullscreen = new function(){

	this.fullscreens = [];
	this.zIndex = 5;
	this.margin = 20;

    this.frameContainer = function(onClose){
        var content = $("<div/>");
		content.addClass("blockContent");
		var closeButton = $("<div/>");
		closeButton.addClass("closeFullscreeen");
		content.append(closeButton);
		closeButton.click(function(){
            if( onClose ){
                onClose();
            }
			fullscreen.removeFullscreen();
		});
        return content;
    }

	this.dialogContent = function(dialog){

        var onClose = function(){
            dialog.appendToParent();
        }
        var content = this.frameContainer(onClose);
		var contentDiv = $("<div/>").appendTo(content);

		var x = Archaeo18_properties.fullscreenFormatX;
		var y = Archaeo18_properties.fullscreenFormatY;
		var w, h, t, l;
		if( x && y ){
			if( x > y ){
				w = $(document).width() - 100;
				h = Math.floor(w*y/x);
				l = 50;
				t = Math.floor(($(document).height() - h)/2);
			}
			else {
				h = $(document).height() - 100;
				w = Math.floor(h*x/y);
				l = Math.floor(($(document).width() - w)/2);
				t = 50;
			}
		}
		else {
			h = $(document).height() - 100;
			w = $(document).width() - 100;
			l = 50;
			t = 50;
		}
		w -= 2*this.margin;
		h -= 2*this.margin;
		contentDiv.css('margin',this.margin+'px');
		contentDiv.css('width', (w+2*this.margin)+'px');
		contentDiv.css('height', (h+2*this.margin)+'px');

		var headline = $("<div/>");
		headline.addClass("fullscreenHeader");
		headline.attr("innerHTML", dialog.document.title);
		headline.css('padding-bottom','10px');
		contentDiv.append(headline);
		contentDiv.append(dialog.container);

        return content;

	}

	this.loaderContent = function(){
		var loader = new Image();
		loader.src = STIStatic.path+"ajax-loader.gif";
	    	var content = $("<div/>");
		content.css('position','absolute');
		//content.append("<img src='images/ajax-loader.gif'/>");
		//vhz
		content.append("<div id=\"FullscreenWindowHeader\" align=\"center\"><h1>Starting STIF.... </h1></div>");
		//~vhz
		content.append("<img src='" + loader.src + "'/>");		
		content.append("<div id=\"FullscreenWindowLog\" align=\"center\">Loading scripts</div>");
		return content;
	}

	this.downloadContent = function(url){
	   var content = this.frameContainer();
   		var contentDiv = $("<div/>").appendTo(content);
		contentDiv.css('margin',this.margin+'px');
		contentDiv.css('width','400px');
		contentDiv.css('font-family','Arial');
		var file = url.substring(url.lastIndexOf("/")+1);
		contentDiv.append( "<h2 style='text-align:center;'>" + Archaeo18Gui.getString('downloadHeader') + "</h2>" );
		contentDiv.append( "<p style='text-align:center;'>" + file + "</p>" );
		var save;
		var browser = BrowserDetect.browser;
		if( browser == "Chrome" || browser == "Firefox" || browser == "Safari" || browser == "Opera" || browser == "Explorer" ){
		      save = Archaeo18Gui.getString('downloadSave') + " <strong>" + Archaeo18Gui.getString(browser+'Download') + "</strong>";
        }
        else {
		      save = Archaeo18Gui.getString('DefaultDownload');
        }
        contentDiv.append( "<p>1. <strong>" + Archaeo18Gui.getString('save') + "</strong>: <br>" + save + "</p>" );
	  	var downloadCenter = "<a href='"+url+"'><img src='images/tei.png'/></a>";
		contentDiv.append("<p style='text-align:center;'>"+downloadCenter+"</p>");
		var open = Archaeo18Gui.getString('open');
		var open2 = Archaeo18Gui.getString('downloadOpen');
		var link = "<a href='"+url+"' target='_blank'>" + Archaeo18Gui.getString('here') + "</a>";
		contentDiv.append( "<p>2. <strong>" + open + "</strong>: <br>" + open2 + " <strong>" + link + "</strong> ...</p>" );
		return content;
	}

    this.addFullscreen = function(content){
		var blockDiv = $("<div/>").appendTo('body');
		blockDiv.addClass("blockDiv");
		blockDiv.css('width',$(document).width()+'px');
		blockDiv.css('height',$(document).height()+'px');
//		blockDiv.css('z-index',++this.zIndex);
		var overlay = $("<div/>").appendTo(blockDiv);
		overlay.addClass("blockDivOverlay");
		overlay.css('width',$(document).width()+'px');
		overlay.css('height',$(document).height()+'px');
		$(content).appendTo(blockDiv);
		this.fullscreens.push({
		      content: content,
		      overlay: overlay,
		      blockDiv: blockDiv
        });
        this.centerDiv(content);
    }

    this.centerDiv = function(div){
        var left = Math.floor($(document).width()/2-div.width()/2);
        var top = Math.floor($(window).height()/2-div.height()/2);
		div.css('top', top+'px');
		div.css('left', left+'px');
    }

	this.removeFullscreen = function(){
	   $(this.fullscreens[this.fullscreens.length-1].blockDiv).remove();
	   this.fullscreens.pop();
	}

	this.resize = function(){
	   for( var i in this.fullscreens ){
            this.fullscreens[i].blockDiv.css('width',$(document).width()+'px');
            this.fullscreens[i].blockDiv.css('height',$(document).height()+'px');
            this.fullscreens[i].overlay.css('width',$(document).width()+'px');
            this.fullscreens[i].overlay.css('height',$(document).height()+'px');
            this.centerDiv(this.fullscreens[i].content);
	   }
	}

}
