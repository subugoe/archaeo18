/**
 * @class Popup
 * Implementation for Popup box
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function Popup(parent){

	this.parentDiv = parent.mapWindow;

	this.initialize = function(x,y,content,onclose){

		var popup = this;
		this.x = x;
		this.y = y;

		this.popupDiv = document.createElement("div");
		this.popupDiv.setAttribute('class','ddbPopupDiv');
		this.parentDiv.appendChild(this.popupDiv);

		this.cancel = document.createElement("div");
		this.cancel.setAttribute('class','ddbPopupCancel');
		this.cancel.onclick = function(){
			if( typeof onclose != 'undefined' ){
				onclose();
			}
			popup.reset();
		}

		this.input = document.createElement("div");
		this.input.style.maxWidth = Math.floor(this.parentDiv.offsetWidth*0.75)+"px";
		this.input.style.maxHeight = Math.floor(this.parentDiv.offsetHeight*0.75)+"px";
		this.input.setAttribute('class','ddbPopupInput');

		this.popupDiv.appendChild(this.input);
		this.popupDiv.appendChild(this.cancel);

		var peak = document.createElement("div");
		peak.setAttribute('class','popupPeak');
		this.popupDiv.appendChild(peak);
		var topRight = document.createElement("div");
		topRight.setAttribute('class','popupTopRight');
		this.popupDiv.appendChild(topRight);
		var bottomRight = document.createElement("div");
		bottomRight.setAttribute('class','popupBottomRight');
		this.popupDiv.appendChild(bottomRight);
		this.popupRight = document.createElement("div");
		this.popupRight.setAttribute('class','popupRight');
		this.popupDiv.appendChild(this.popupRight);
		this.popupBottom = document.createElement("div");
		this.popupBottom.setAttribute('class','popupBottom');
		this.popupDiv.appendChild(this.popupBottom);

		this.visible = true;
		$(this.input).append(content);
		this.decorate();

	}

	this.reset = function(){
		$(this.popupDiv).remove();
	        this.visible = false;
	}

	this.updateContent = function(content){
		$(this.input).empty();
		$(this.input).append(content);
	}

	this.decorate = function(){
		this.popupRight.style.height = (this.popupDiv.offsetHeight-14)+"px";
		this.popupBottom.style.width = (this.popupDiv.offsetWidth-22)+"px";
		this.left = this.x + 9;
		this.top = this.y - 10 - this.popupDiv.offsetHeight;
		this.popupDiv.style.left = this.left+"px";
		this.popupDiv.style.top = this.top+"px";
		var shiftX = 0, shiftY = 0;
		if( this.popupDiv.offsetTop < gui.mapToolbar.offsetHeight + 10 ){
			shiftY = -1*(gui.mapToolbar.offsetHeight + 10 - this.popupDiv.offsetTop);
		}
		if( this.popupDiv.offsetLeft + this.popupDiv.offsetWidth > gui.mapToolbar.offsetWidth - 10 ){
			shiftX = -1*(gui.mapToolbar.offsetWidth - 10 - this.popupDiv.offsetLeft - this.popupDiv.offsetWidth);
		}
		gui.map.shift(shiftX,shiftY);
	}

	this.shift = function(x,y){
		this.left = this.left-this.x+x;
		this.top = this.top-this.y+y;
		this.x = x;
		this.y = y;
		if( this.left + this.popupDiv.offsetWidth > this.parentDiv.offsetWidth ){
			this.popupDiv.style.left = 'auto';
			this.popupDiv.style.right = (this.parentDiv.offsetWidth-this.left-this.popupDiv.offsetWidth)+"px";
		}
		else {
			this.popupDiv.style.right = 'auto';
			this.popupDiv.style.left = this.left+"px";
		}
		this.popupDiv.style.top = this.top+"px";
	}

}
