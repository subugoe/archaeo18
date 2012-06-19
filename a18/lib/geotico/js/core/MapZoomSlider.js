/**
 * @class FilterBar
 * Implementation for MapZoomSlider Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function MapZoomSlider(parent,orientation){

   	this.parent = parent;

   	var zs = this;
   	this.div = document.createElement("div");
   	this.div.setAttribute('class','sliderStyle-'+orientation);

	var sliderContainer = document.createElement("div");
	sliderContainer.setAttribute('class','zoomSliderContainer-'+orientation);
	var sliderDiv = document.createElement("div");
	sliderDiv.tabIndex = 1;
	var sliderInputDiv = document.createElement("div");
	sliderDiv.appendChild(sliderInputDiv);
	sliderContainer.appendChild(sliderDiv);
	this.slider = new Slider( sliderDiv, sliderInputDiv, orientation );
	this.div.appendChild(sliderContainer);

	var zoomIn = document.createElement("img");
	zoomIn.src = STIStatic.path+"zoom_in.png";
	zoomIn.setAttribute('class','zoomSliderIn-'+orientation);
	zoomIn.onclick = function(){
        zs.parent.zoom(1);
	}
	this.div.appendChild(zoomIn);

	var zoomOut = document.createElement("img");
	zoomOut.src = STIStatic.path+"zoom_out.png";
	zoomOut.setAttribute('class','zoomSliderOut-'+orientation);
	zoomOut.onclick = function(){
        zs.parent.zoom(-1);
	}
	this.div.appendChild(zoomOut);

	this.slider.onclick = function(){
		console.info(zs.slider.getValue());
	}

	this.slider.handle.onmousedown = function(){
		var oldValue = zs.slider.getValue();
		document.onmouseup = function(){
			if( !zs.parent.zoom( (zs.slider.getValue()-oldValue) / zs.max*zs.levels ) ){
				zs.setValue(oldValue);
			}
			document.onmouseup = null;
		}
	}

	this.setValue = function(value){
		this.slider.setValue(value/this.levels*this.max);
	}

	this.setMaxAndLevels = function(max,levels){
		this.max = max;
		this.levels = levels;
		this.slider.setMaximum(max);
	}

//	this.setMaxAndLevels(1000,parent.openlayersMap.getNumZoomLevels());
//	this.setValue(parent.openlayersMap.getZoom());

	this.setLanguage = function(){
		zoomIn.title = STIStatic.getString('zoomIn');
		zoomOut.title = STIStatic.getString('zoomOut');
		this.slider.handle.title = STIStatic.getString('zoomSlider');
	}

}
