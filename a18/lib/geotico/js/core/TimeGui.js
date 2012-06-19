function TimeGui(plot,div,title){

	var gui = this;

	this.plot = plot;

    	this.container = div;
	if( STIStatic.timeplotWidth ){
		this.container.style.width = STIStatic.timeplotWidth;
        }
        if( STIStatic.timeplotHeight ){
        	this.container.style.height = STIStatic.timeplotHeight;
        }
        
        var w = this.container.offsetWidth;
        var h = this.container.offsetHeight;

	var toolbarTable = document.createElement("table");
	toolbarTable.setAttribute('class','ddbToolbar');
	this.container.appendChild(toolbarTable);

        this.plotWindow = document.createElement("div");
		this.plotWindow.id = "plotWindow";
		this.plotWindow.style.width = w+"px";

		this.plotWindow.style.height = (h+12)+"px";
		this.container.style.height = (h+12)+"px";
		
		this.plotWindow.onmousedown = function(){
		  return false;
		}

		this.plotContainer = document.createElement("div");
		this.plotContainer.id = "plotContainer";
		this.plotContainer.style.width = w+"px";
		this.plotContainer.style.height = h+"px";
		this.plotContainer.style.position = "absolute";
		this.plotContainer.style.zIndex = 0;
		this.plotContainer.style.top = "12px";
		this.plotWindow.appendChild(this.plotContainer);
		this.container.appendChild(this.plotWindow);

        this.timeplotDiv = document.createElement("div");
        this.timeplotDiv.style.left = "16px";
        this.timeplotDiv.style.width = (w-32)+"px";
        this.timeplotDiv.style.height = h+"px";
        this.plotContainer.appendChild(this.timeplotDiv);

		var titles = document.createElement("tr");
		toolbarTable.appendChild(titles);
		var tools = document.createElement("tr");
		toolbarTable.appendChild(tools);

		this.timeUnitTitle = document.createElement("td");
		this.timeUnitTitle.innerHTML = STIStatic.getString('timeUnit');
		titles.appendChild(this.timeUnitTitle);
		this.timeUnitSelector = document.createElement("td");
		tools.appendChild(this.timeUnitSelector);


		this.timeAnimation = document.createElement("td");
		this.timeAnimation.innerHTML = STIStatic.getString('timeAnimation');
		var timeAnimationTools = document.createElement("td");

		var status;
		this.updateAnimationButtons = function(s){
			status = s;
			if( status == 0 ){
				gui.playButton.setAttribute('class','smallButton playDisabled');
				gui.pauseButton.setAttribute('class','smallButton pauseDisabled');
			}
			else if( status == 1 ){
				gui.playButton.setAttribute('class','smallButton playEnabled');
				gui.pauseButton.setAttribute('class','smallButton pauseDisabled');
			}
			else {
				gui.playButton.setAttribute('class','smallButton playDisabled');
				gui.pauseButton.setAttribute('class','smallButton pauseEnabled');
			}
		};
		this.playButton = document.createElement("div");
		this.playButton.title = STIStatic.getString('playButton');
		timeAnimationTools.appendChild(this.playButton);
		this.playButton.onclick = function(){
			if( status == 1 ){
				plot.play();
			}
		}
		
		this.pauseButton = document.createElement("div");
		this.pauseButton.title = STIStatic.getString('pauseButton');
		timeAnimationTools.appendChild(this.pauseButton);
		this.pauseButton.onclick = function(){
			if( status == 2 ){
				plot.stop();
			}
		}

		this.valueScale = document.createElement("td");
		this.valueScale.innerHTML = STIStatic.getString('valueScale');
		var valueScaleTools = document.createElement("td");

		var linearPlot;
		var setValueScale = function(linScale){
			if( linearPlot != linScale ){
				linearPlot = linScale;
				if( linearPlot ){
					gui.linButton.setAttribute('class','smallButton linearPlotActivated');
					gui.logButton.setAttribute('class','smallButton logarithmicPlotDeactivated');
					plot.drawLinearPlot();
				}
				else {
					gui.linButton.setAttribute('class','smallButton linearPlotDeactivated');
					gui.logButton.setAttribute('class','smallButton logarithmicPlotActivated');
					plot.drawLogarithmicPlot();
				}
			}
		};
		this.linButton = document.createElement("div");
		this.linButton.title = STIStatic.getString('linearPlot');
		valueScaleTools.appendChild(this.linButton);
		this.linButton.onclick = function(){
			setValueScale(true);
		}
		
		this.logButton = document.createElement("div");
		this.logButton.title = STIStatic.getString('logarithmicPlot');
		valueScaleTools.appendChild(this.logButton);
		this.logButton.onclick = function(){
			setValueScale(false);
		}

		titles.appendChild(this.timeAnimation);
		tools.appendChild(timeAnimationTools);

		titles.appendChild(this.valueScale);
		tools.appendChild(valueScaleTools);

		this.updateAnimationButtons(0);
		setValueScale(STIStatic.linearScale);

	if( STIStatic.dataInformation ){
		this.infoTitle = document.createElement("td");
		this.infoTitle.innerHTML = title;
		titles.appendChild(this.infoTitle);
		var timeSum = document.createElement("td");
		this.timeElements = document.createElement("div");
		this.timeElements.setAttribute('class','ddbElementsCount');
		timeSum.appendChild(this.timeElements);
		tools.appendChild(timeSum);
	}

/*
		var tooltip = document.createElement("div");
		tooltip.setAttribute('class','ddbTooltip');
		toolbarTable.appendChild(tooltip);

		tooltip.onmouseover = function(){
			/*
		    getPublisher().Publish('TooltipContent', {
						content: STIStatic.getString(STIStatic.language,'timeHelp'),
						target: $(tooltip)
					    });
			
		}
		tooltip.onmouseout = function(){
		    //getPublisher().Publish('TooltipContent');
		}

/*
		var sumElementsFailed = document.createElement("td");
		sumElementsFailed.innerHTML = "19 Results without time information";
		tools.appendChild(sumElementsFailed);
*/

//		toolbarTable.style.height = (toolbarTable.offsetHeight+2*this.verticalMargin)+"px";
		
//		this.plot.plotWindow.style.top = (plotToolbar.offsetHeight-1)+"px";

		this.setHeight = function(){
			this.container.style.height = (this.plotWindow.offsetHeight+toolbarTable.offsetHeight)+"px";
		};


	this.updateTimeQuantity = function(count){
		if( STIStatic.dataInformation ){
			this.plotCount = count;
			if( count != 1 ){
				this.timeElements.innerHTML = this.beautifyCount(count)+" "+STIStatic.getString('results');
			}
			else {
				this.timeElements.innerHTML = this.beautifyCount(count)+" "+STIStatic.getString('result');
			}
		}
	}

	this.setTimeUnitDropdown = function(units){
		$(this.timeUnitSelector).empty();
		var gui = this;
		var timeUnits = [];
		var addUnit = function(unit,index){
			var setUnit = function(){
			    gui.plot.setTimeUnit(unit.unit);
			}
			timeUnits.push({
				name: unit.label,
				onclick: setUnit
			});
		}
		for( var i=0; i<units.length; i++ ){
			addUnit(units[i],i);
		}
		this.timeUnitDropdown = new Dropdown(this.timeUnitSelector,timeUnits,STIStatic.getString('selectTimeUnit'));
		this.timeUnitDropdown.setEntry(0);
	}
	this.setTimeUnitDropdown( [ { name: 'none', id: -1 } ] );

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

	this.hideTimeUnitSelection = function(){
		this.timeUnitTitle.style.display = 'none';
		this.timeUnitSelector.style.display = 'none';
	}

};
