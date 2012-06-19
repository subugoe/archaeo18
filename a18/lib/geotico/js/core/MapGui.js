function MapGui(map,div,title){

	this.map = map;

	this.container = div;
	if( STIStatic.mapWidth ){
		this.container.style.width = STIStatic.mapWidth;
	}
	if( STIStatic.mapHeight ){
		this.container.style.height = STIStatic.mapHeight;
	}

	this.mapWindow = document.createElement("div");
	this.mapWindow.id = "mapWindow";
	this.container.appendChild(this.mapWindow);
        
	this.mapContainer = document.createElement("div");
	this.mapContainer.id = "mapContainer";
	this.mapContainer.style.position = "absolute";
	this.mapContainer.style.zIndex = 0;
	this.mapWindow.appendChild(this.mapContainer);

	this.background = document.createElement("canvas");
        this.background.setAttribute('class','mapCanvas');
        this.mapWindow.appendChild(this.background);
        if (!this.background.getContext && G_vmlCanvasManager){
            this.background = G_vmlCanvasManager.initElement(this.background);
	}
    
	var toolbarTable = document.createElement("table");
	toolbarTable.setAttribute('class','absoluteToolbar ddbToolbar');
	this.container.appendChild(toolbarTable);
	this.mapToolbar = toolbarTable;

	var titles = document.createElement("tr");
	toolbarTable.appendChild(titles);
	var tools = document.createElement("tr");
	toolbarTable.appendChild(tools);

	if( STIStatic.mapSelection ){
		this.mapTypeTitle = document.createElement("td");
		titles.appendChild(this.mapTypeTitle);
		this.mapTypeTitle.innerHTML = STIStatic.getString('mapType');
		this.mapTypeSelector = document.createElement("td");
		tools.appendChild(this.mapTypeSelector);
	}

	if( STIStatic.mapSelectionTools ){
		this.mapSelectorTitle = document.createElement("td");
		titles.appendChild(this.mapSelectorTitle);
		this.mapSelectorTitle.innerHTML = STIStatic.getString('mapSelectorTools');
		var mapSelectorTools = document.createElement("td");
		var selectorTools = this.map.initSelectorTools();
		for( var i in selectorTools ){
			mapSelectorTools.appendChild(selectorTools[i].button);
		}
		tools.appendChild(mapSelectorTools);
	}
	
	if( STIStatic.binningSelection ){
		this.binningTitle = document.createElement("td");
		titles.appendChild(this.binningTitle);
		this.binningTitle.innerHTML = STIStatic.getString('binningType');
		this.binningSelector = document.createElement("td");
		tools.appendChild(this.binningSelector);
	}
		
	if( STIStatic.dataInformation ){
		this.infoTitle = document.createElement("td");
		this.infoTitle.innerHTML = title;
		titles.appendChild(this.infoTitle);
		var mapSum = document.createElement("td");
		this.mapElements = document.createElement("div");
		this.mapElements.setAttribute('class','ddbElementsCount');
		mapSum.appendChild(this.mapElements);
		tools.appendChild(mapSum);
	}

	var gui = this;
	if( navigator.geolocation && STIStatic.geoLocation ){
		this.geoActive = false;
		this.geoLocation = document.createElement("div");
		this.geoLocation.setAttribute('class','geoLocationOff');
		this.geoLocation.title = STIStatic.getString('activateGeoLocation');
		this.container.appendChild(this.geoLocation);
		this.geoLocation.style.left = "20px";
		this.geoLocation.onclick = function(){
			var changeStyle = function(){
				if( gui.geoActive ){
					gui.geoLocation.setAttribute('class','geoLocationOn');
			                gui.geoLocation.title = STIStatic.getString(STIStatic.language,'deactivateGeoLocation');
				}
				else {
					gui.geoLocation.setAttribute('class','geoLocationOff');
			                gui.geoLocation.title = STIStatic.getString(STIStatic.language,'activateGeoLocation');
				}
			}
			if( !gui.geoActive ){
				if( typeof gui.longitude == 'undefined' ){
					navigator.geolocation.getCurrentPosition(function(position){
					  	gui.longitude = position.coords.longitude;
						gui.latitude = position.coords.latitude;
						gui.map.setMarker(gui.longitude,gui.latitude);
						gui.geoActive = true;
						changeStyle();
					}, function(msg){
						console.log(typeof msg == 'string' ? msg : "error");
					});
				}
				else {
					gui.map.setMarker(gui.longitude,gui.latitude);
					gui.geoActive = true;
					changeStyle();
				}
			}
			else {
				gui.map.removeMarker();
				gui.geoActive = false;
				changeStyle();
			}
		}
	}

	if( !STIStatic.olNavigation ){
		this.map.zoomSlider = new MapZoomSlider(this.map,"vertical");
		this.container.appendChild(this.map.zoomSlider.div);
		this.map.zoomSlider.div.style.left = "20px";
	}

	if( STIStatic.resetMap ){
		this.homeButton = document.createElement("div");
		this.homeButton.setAttribute('class','mapHome');
		this.homeButton.title = STIStatic.getString('home');
		this.container.appendChild(this.homeButton);
		this.homeButton.style.left = "20px";
		this.homeButton.onclick = function(){
			gui.map.drawObjectLayer(true);
		}
	}

//		var tooltip = document.createElement("div");
//		tooltip.setAttribute('class','ddbTooltip');
//		toolbarTable.appendChild(tooltip);

//		var tooltip = document.createElement("div");
//		tooltip.setAttribute('class','ddbTooltip');
//		toolbarTable.appendChild(tooltip);
//
//		tooltip.onmouseover = function(){
//			/*
//		    Publisher.Publish('TooltipContent', {
//						content: STIStatic.getString(STIStatic.language,'timeHelp'),
//						target: $(tooltip)
//					    });
//			*/
//		}
//		tooltip.onmouseout = function(){
//		 //   Publisher.Publish('TooltipContent');
//		}
//		//vhz tooltip on click should open a help file if defined in STIStatic
//		if(STIStatic.helpURL) {
//			tooltip.onclick = function () {
//				
//			}
//		}
			
//		}
//		tooltip.onmouseout = function(){
//   			Publisher.Publish('TooltipContent');
//		}

	this.resize = function(){
		var w = this.container.offsetWidth;
		var h = this.container.offsetHeight;
		this.mapWindow.style.width = w+"px";
		this.mapWindow.style.height = h+"px";
		this.mapContainer.style.width = w+"px";
		this.mapContainer.style.height = h+"px";
		var top = toolbarTable.offsetHeight + 20;
		if( typeof this.geoLocation != "undefined" ){
			this.geoLocation.style.top = top+"px";
			top += this.geoLocation.offsetHeight+4;
		}
		if( STIStatic.olNavigation ){
			var panBar = $(".olControlPanPanel")[0];
			var zoomBar = $(".olControlZoomPanel")[0];
			$(panBar).css('top',top+'px');
			var panSouth = $(".olControlPanSouthItemInactive")[0];
			top = $(panSouth).height() + $(panSouth).offset().top;
			$(zoomBar).css('top',top+'px');
			var zoomOut = $(".olControlZoomOutItemInactive")[0];
			top = $(zoomOut).height() + $(zoomOut).offset().top;
		}
		else {
			this.map.zoomSlider.div.style.top = top+"px";
			top += this.map.zoomSlider.div.offsetHeight+2;
		}
		if( STIStatic.resetMap ){
			this.homeButton.style.top = top+"px";
		}
	    	this.background.width = w;
	    	this.background.height = h;
		var ctx = this.background.getContext('2d');
		var gradient = ctx.createLinearGradient(0, 0, 0, h);
		gradient.addColorStop(0, STIStatic.mapCanvasFrom);
		gradient.addColorStop(1, STIStatic.mapCanvasTo);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, w, h);
		this.headerHeight = toolbarTable.offsetHeight;
		this.headerWidth = toolbarTable.offsetWidth;
	};
	this.resize();

	this.updateSpaceQuantity = function(count){
		if( !STIStatic.dataInformation ){
			return;
		}
		this.mapCount = count;
		if( count != 1 ){
			this.mapElements.innerHTML = this.beautifyCount(count)+" "+STIStatic.getString('results');
		}
		else {
			this.mapElements.innerHTML = this.beautifyCount(count)+" "+STIStatic.getString('result');
		}
	}

    this.setMapsDropdown = function(){
	if( !STIStatic.mapSelection ){
		return;
	}
    	$(this.mapTypeSelector).empty();
		var maps = [];
		var gui = this;
		var addMap = function(name,index){
			var setMap = function(){
				gui.map.setMap(index);
			}
			maps.push({
				name: name,
				onclick: setMap
			});
		}
		for( var i=0; i<this.map.baseLayers.length; i++ ){
			addMap(this.map.baseLayers[i].name,i);
		}
		this.mapTypeDropdown = new Dropdown(this.mapTypeSelector,maps,STIStatic.getString('selectMapType'));
    }

	this.setMap = function(){
		if( STIStatic.mapSelection ){
			this.mapTypeDropdown.setEntry(this.map.baselayerIndex);
		}
	}

	this.setBinningDropdown = function(){
		if( !STIStatic.binningSelection ){
			return;
		}
	    	$(this.binningSelector).empty();
		var binnings = [];
		var gui = this;
		var index = 0;
		var entry;
		var addBinning = function(name,id){
			if( STIStatic.binning == id ){
				entry = index;	
			}
			else {
				index++;
			}
			var setBinning = function(){
				STIStatic.binning = id;
				gui.map.initMap(gui.map.mapObjects,false);
				gui.map.riseLayer();
			}
			binnings.push({
				name: name,
				onclick: setBinning
			});
		}
		addBinning(STIStatic.getString('genericBinning'),'generic');
		addBinning(STIStatic.getString('squareBinning'),'square');
		addBinning(STIStatic.getString('hexagonalBinning'),'hexagonal');
		addBinning(STIStatic.getString('triangularBinning'),'triangular');
		addBinning(STIStatic.getString('noBinning'),false);
		var binningDropdown = new Dropdown(this.binningSelector,binnings,STIStatic.getString('binningTooltip'));
		binningDropdown.setEntry(entry);
	}
    	this.setBinningDropdown();

    this.beautifyCount = function(count){
   		var c = count+'';
  		var p = 0;
   		var l = c.length;
   		while( l-p > 3 ){
   			p += 3;
   			c = c.substring(0,l-p) + "." + c.substring(l-p);
   			p++;
   			l++;
   		}
    	return c;
    }

};
