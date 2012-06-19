/**
 * @class PlacenameTags
 * Implementation for Placename Tag Cloud (does not work at the moment)
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function PlacenameTags(circle,map){
	
	this.circle = circle;
	this.map = map;
	
	this.placeLabels;
	this.selectedLabel;

	this.allLabel;
	this.othersLabel;
	this.unknownLabel;
		
	this.calculate = function(){		
		this.calculateLabels();
		this.calculatePlacenameTags();
	}
	
	this.calculateLabels = function(){
		var elements = this.circle.elements;
		var k = this.circle.search;
		var weight = 0;
		var labels = [];
		var levelOfDetail = this.map.getLevelOfDetail();
		for( var i=0; i<elements.length; i++ ){
			weight += elements[i].weight;
			var found = false;
			var label = elements[i].getPlace(this.map.placeIndex,levelOfDetail);
			if( label == "" ){
				label = "unknown";
			}
			for( var j=0; j<labels.length; j++ ){
				if( labels[j].place == label ){
					labels[j].elements.push(elements[i]);
					labels[j].weight += elements[i].weight;
					found = true;
					break;
				}
			}
			if( !found ){
				labels.push( { id: elements[i].name, place: label, elements: new Array(elements[i]), weight: elements[i].weight, index: k } );
			}
		}
		var sortBySize = function(label1, label2){
		    if (label1.weight > label2.weight){ 
		        return -1;
				}
		    return 1;
		}
		labels.sort(sortBySize);
		if( STIStatic.maxPlaceLabels ){
			var ml = STIStatic.maxPlaceLabels;
			if( ml == 1 ){
				labels = [];
				labels.push( { place: "all", elements: elements, weight: weight, index: k } );
			}
			if( ml == 2 ){
				ml++;
			}
			if( ml > 2 && labels.length+1 > ml ){
				var c = [];
				var w = 0;
				for( var i=ml-2; i<labels.length; i++ ){
					c = c.concat(labels[i].elements);
					w += labels[i].weight;
				}
				labels = labels.slice(0,ml-2);
				labels.push( { place: "others", elements: c, weight: w, index: k } );
			}
		}
		if( labels.length > 1 ){
			labels.push( { place: "all", elements: elements, weight: weight, index: k } );
		}
		this.placeLabels = labels;
	};
		
	this.calculatePlacenameTags = function(){
		var cloud = this;

		var c = STIStatic.colors[this.circle.search];
		var color0 = 'rgb('+c.r0+','+c.g0+','+c.b0+')';
		var color1 = 'rgb('+c.r1+','+c.g1+','+c.b1+')';
		var allStyles = "", hoverStyle = "", selectedStyle = "", unselectedStyle = "", altStyle = "";
        if( STIStatic.placeLabelStyles == "shadows" ){
            hoverStyle += "color: "+color0+"; text-shadow: "+STIStatic.shadowHovered.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0)+";";
            selectedStyle += "color: "+color1+"; text-shadow: "+STIStatic.shadowSelected.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0)+";";
            unselectedStyle += "color: "+color0+"; text-shadow: "+STIStatic.shadowUnselected.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0)+";";
            altStyle += "color: "+color1+";";
        }
        else if( STIStatic.placeLabelStyles == "frames" ){
            allStyles += "padding: 0px 5px; opacity: 0.8; color: "+color1+"; background-color: "+color0+";";
			if( STIStatic.ie8 ){
				allStyles += "filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';";
			}
            hoverStyle += "border: 1px solid "+color1+";";
            selectedStyle += "border: 1px solid "+color1+";";
            unselectedStyle += "border: 1px solid "+color0+";";
        }
        else if( STIStatic.placeLabelStyles == "custom" ){
            hoverStyle += STIStatic.customHovered.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0);
            selectedStyle += STIStatic.customSelected.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0);
            unselectedStyle += STIStatic.customUnselected.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0);
        }
		if( STIStatic.selectedPlaceStyle == "underline" ){
			selectedStyle += "text-decoration: underline;";
			unselectedStyle += "text-decoration: none;";
		}
		else if( STIStatic.selectedPlaceStyle == "bold" ){
			selectedStyle += "font-weight: bold;";
			unselectedStyle += "font-weight: normal;";
		}
		else {
			selectedStyle += STIStatic.customSelectedPlace.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0);
			unselectedStyle += STIStatic.customUnselectedPlace.replace(/COLOR1/g,color1).replace(/COLOR0/g,color0);
		}
		
		var clickFunction = function(label){
			label.div.onclick = function(){
				cloud.changeLabelSelection(label);
			}
			label.div.onmouseover = function(){
				if( STIStatic.labelHover ){
					if( label != cloud.selectedLabel ){
				        label.div.setAttribute('style',label.allStyle+""+label.hoverStyle);
						cloud.map.mapLabelHighlight(label,false);
					}
				}
			}
			label.div.onmouseout = function(){
				if( STIStatic.labelHover ){
					if( label != cloud.selectedLabel ){
						label.div.setAttribute('style',label.allStyle+""+label.unselectedStyle);
						cloud.map.mapLabelHighlight(label,true);
					}
				}
			}
		}
		var maxLabelSize = this.count
		for( var i=0; i<this.placeLabels.length; i++ ){
			var l = this.placeLabels[i];
			l.selected = false;				
			var div = document.createElement("div");
			div.setAttribute('class','tagCloudItem');
			var fontSize = 1 + (l.weight-1)/this.map.count * STIStatic.maxLabelIncrease;
			if( l.place == "all" ){
				fontSize = 1;
			}
			div.style.fontSize = fontSize+"em";
			l.allStyle = allStyles +"font-size: "+fontSize+"em;";
			l.selectedStyle = selectedStyle;
			l.unselectedStyle = unselectedStyle;
			l.hoverStyle = hoverStyle;
			l.altStyle = altStyle;
			div.innerHTML = l.place + "<span style='font-size:"+(1/fontSize)+"em'>&nbsp;(" + l.weight + ")</span>"; 
			l.div = div;
			clickFunction(l);
		}
		if( STIStatic.labelGrid ){
			this.showPlacelabels();
		}
		else {
			for( var i=0; i<this.placeLabels.length; i++ ){
				this.placeLabels[i].div.setAttribute('style',this.placeLabels[i].allStyle+""+this.placeLabels[i].unselectedStyle);
			}
		}
	};
	
	this.selectLabel = function(label){
		if( typeof label == 'undefined' ){
			label = this.placeLabels[this.placeLabels.length-1];
		}
		if( this.map.popup ){
			this.map.popup.showLabelContent(label);
		}
		this.selectedLabel = label;
		this.selectedLabel.div.setAttribute('style',this.selectedLabel.allStyle+""+this.selectedLabel.selectedStyle);
		this.map.mapLabelSelection(label);
	};
	
	// changes selection between labels (click, hover)
	this.changeLabelSelection = function(label){
		if( this.selectedLabel == label ){
			return;
		}
		if( typeof this.selectedLabel != 'undefined' ){
			this.selectedLabel.div.setAttribute('style',this.selectedLabel.allStyle+""+this.selectedLabel.altStyle);
		}
		this.selectLabel(label);
	};
	
	this.showPlacelabels = function(){
		this.leftDiv = document.createElement("div");
		this.leftDiv.setAttribute('class','tagCloudDiv');
		this.map.gui.mapWindow.appendChild(this.leftDiv);
		this.rightDiv = document.createElement("div");
		this.rightDiv.setAttribute('class','tagCloudDiv');
		this.map.gui.mapWindow.appendChild(this.rightDiv);
		for( var i=0; i<this.placeLabels.length; i++ ){
			if( i%2 == 0 ){
				this.leftDiv.appendChild(this.placeLabels[i].div);
			}
			else {
				this.rightDiv.appendChild(this.placeLabels[i].div);
			}
			this.placeLabels[i].div.setAttribute('style',this.placeLabels[i].allStyle+""+this.placeLabels[i].unselectedStyle);
		}
		this.placeTagCloud();
	};

	this.placeTagCloud = function(){
		var lonlat = new OpenLayers.LonLat( this.circle.feature.geometry.x, this.circle.feature.geometry.y );
		var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
		var radius = this.circle.feature.style.pointRadius;
		var lw = this.leftDiv.offsetWidth;
		var rw = this.rightDiv.offsetWidth;
		this.leftDiv.style.left = (pixel.x-radius-lw-5)+"px";
		this.rightDiv.style.left = (pixel.x+radius+5)+"px";
		var lh = this.leftDiv.offsetHeight;
		var rh = this.rightDiv.offsetHeight;
		var lt = pixel.y - lh/2; 
		var rt = pixel.y - rh/2;
		this.leftDiv.style.top = lt+"px";
		this.rightDiv.style.top = rt+"px";
	};

	this.remove = function(){
		$(this.leftDiv).remove();
		$(this.rightDiv).remove();
	};	

};

function PlacenamePopup(parent){

	this.parentDiv = parent.gui.mapWindow;

	this.createPopup = function(x,y,labels){
		var popup = this;
		this.x = x;
		this.y = y;
		this.labels = labels;
		this.popupDiv = document.createElement("div");
		this.popupDiv.setAttribute('class','ddbPopupDiv');
		this.parentDiv.appendChild(this.popupDiv);
		this.cancel = document.createElement("div");
		this.cancel.setAttribute('class','ddbPopupCancel');
		this.cancel.onclick = function(){
			parent.deselection();
			popup.reset();
		}
		this.resultsLabel = document.createElement("div");
		this.resultsLabel.setAttribute('class','popupDDBResults');
		this.input = document.createElement("div");
		this.input.style.maxWidth = Math.floor(this.parentDiv.offsetWidth*0.75)+"px";
		this.input.style.maxHeight = Math.floor(this.parentDiv.offsetHeight*0.75)+"px";
		this.input.setAttribute('class','ddbPopupInput');
		this.popupDiv.appendChild(this.resultsLabel);

		this.backward = document.createElement("div");
		this.backward.setAttribute('class','prevItem');
		this.popupDiv.appendChild(this.backward);
		this.backward.onclick = function(){
			popup.descriptionIndex--;
			popup.showDescription();
		}

		this.number = document.createElement("div");
		this.popupDiv.appendChild(this.number);
		this.number.style.display = 'none';
		this.number.style.fontSize = '13px';

		this.forward = document.createElement("div");
		this.forward.setAttribute('class','nextItem');
		this.popupDiv.appendChild(this.forward);
		this.forward.onclick = function(){
			popup.descriptionIndex++;
			popup.showDescription();
		}

		this.popupDiv.appendChild(this.input);
		this.popupDiv.appendChild(this.cancel);

		if( STIStatic.showDescriptions ){
		    this.descriptions = document.createElement("div");
		    this.descriptions.setAttribute('class','descriptions');
			this.descriptions.onclick = function(){
				popup.switchToDescriptionMode();	
			}
		}

		this.back = document.createElement("div");
		this.back.setAttribute('class','back');
		this.popupDiv.appendChild(this.back);
		this.back.onclick = function(){
			$(popup.input).empty();
			popup.back.style.display = "none";
			popup.backward.style.display = "none";
			popup.forward.style.display = "none";
			popup.number.style.display = 'none';
			popup.showLabels();
		}

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

		this.listLabels();
		this.showLabels();
		this.updateTexts();
		this.visible = true;
	}

	this.reset = function(){
		$(this.popupDiv).remove();
	        this.visible = false;
	}

	this.switchToDescriptionMode = function(){
		this.descriptionIndex = 0;
		this.descriptionContents = this.activeLabel.descriptions;
		this.number.style.display = 'inline-block';
		this.input.style.minWidth = "300px";
		this.showDescription();
		this.count = this.activeLabel.weight;
		this.setCount();
		this.back.style.display = "inline-block";
	}

	this.showDescription = function(){
		$(this.input).empty();
		this.input.appendChild(this.descriptionContents[this.descriptionIndex]);
		if( this.descriptionContents.length == 1 ){
			this.backward.style.display = "none";
			this.forward.style.display = "none";
		}
		else {
			if( this.descriptionIndex == 0 ){
				this.backward.style.display = "none";
			}
			else {
				this.backward.style.display = "inline-block";
			}
			if( this.descriptionIndex == this.descriptionContents.length - 1 ){
				this.forward.style.display = "none";
			}
			else {
				this.forward.style.display = "inline-block";
			}
		}
		if( this.descriptionContents.length > 1 ){
			this.number.innerHTML = "#"+(this.descriptionIndex+1);
		}
		else {
			this.number.style.display = 'none';
		}
		this.decorate();
	}

	this.setCount = function(){
		var c = this.count;
		if( c > 1 ){
		        this.resultsLabel.innerHTML = c+" "+STIStatic.getString('results');
		}
		else {
		        this.resultsLabel.innerHTML = c+" "+STIStatic.getString('result');
		}
	}
	
	this.listLabels = function(){
		var popup = this;
		this.labelDivs = [];
		this.labelCount = 0;
		this.labelsWidth = 0;
		for( var i=0; i<this.labels.length; i++ ){
			var div = document.createElement("div");
			var content = document.createElement("div");
			this.labels[i].allStyle += "position: relative; white-space: nowrap;";
			content.appendChild(this.labels[i].div);
			content.setAttribute('class','ddbPopupLabel');
			div.appendChild(content);
			this.labels[i].div.setAttribute('style',this.labels[i].allStyle+""+this.labels[i].selectedStyle);
			this.input.appendChild(div);
			if( this.input.offsetWidth > this.labelsWidth ){
				this.labelsWidth = this.input.offsetWidth;
			}
			this.labels[i].div.setAttribute('style',this.labels[i].allStyle+""+this.labels[i].altStyle);
			this.labelDivs.push(div);
			var descriptions = [];
			for( var j=0; j<this.labels[i].elements.length; j++ ){
				var div = document.createElement("div");
				div.innerHTML = this.labels[i].elements[j].description;
				descriptions.push(div);
			}
			this.labels[i].descriptions = descriptions;
			if( this.labels[i].place != "all" || i == 0 ){
				this.labelCount += this.labels[i].weight;
			}
		}
		if( typeof this.descriptions != 'undefined' ){
			this.labelsWidth += 20;
		}
		$(this.input).empty();
	}

	this.showLabels = function(){
		this.count = this.labelCount;
		this.setCount();
		for( var i=0; i<this.labelDivs.length; i++ ){
			this.input.appendChild(this.labelDivs[i]);
		}
		this.input.style.width = this.labelsWidth + "px";
		this.input.style.minWidth = this.labelsWidth + "px";
		this.decorate();
	}

	this.showLabelContent = function(label){
    		for( var i=0; i<this.labels.length; i++ ){
    			if( this.labels[i] == label ){
				this.activeLabel = this.labels[i];
				if( typeof this.descriptions != 'undefined' ){
    					this.labelDivs[i].appendChild(this.descriptions);
				}
				this.decorate();
    				break;
    			}
    		}
	}

	this.decorate = function(){
		this.popupRight.style.height = (this.popupDiv.offsetHeight-14)+"px";
		this.popupBottom.style.width = (this.popupDiv.offsetWidth-22)+"px";
		this.left = this.x + 9;
		this.top = this.y - 10 - this.popupDiv.offsetHeight;
		this.popupDiv.style.left = this.left+"px";
		this.popupDiv.style.top = this.top+"px";
		var shiftX = 0, shiftY = 0;
		if( this.popupDiv.offsetTop < parent.gui.headerHeight + 10 ){
			shiftY = -1*(parent.gui.headerHeight + 10 - this.popupDiv.offsetTop);
		}
		if( this.popupDiv.offsetLeft + this.popupDiv.offsetWidth > parent.gui.headerWidth - 10 ){
			shiftX = -1*(parent.gui.headerWidth - 10 - this.popupDiv.offsetLeft - this.popupDiv.offsetWidth);
		}
		parent.shift(shiftX,shiftY);
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

	this.setLanguage = function(language){
		this.language = language;
		if( this.visible ){
			this.updateTexts();
		}
	}

	this.updateTexts = function(){
		this.cancel.title = STIStatic.getString('close');
		this.setCount();
	}

};
