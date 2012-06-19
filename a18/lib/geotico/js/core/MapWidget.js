/**
 * @class MapWidget
 * Implementation for MapWidget Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

/**
 * defines the map component of the Spatio Temporal Interface.
 * it builds a map context with the OpenLayers JavaScript Framework
 * @param {STICore} core the sti core component, the map component has to deal with
 * @param {String} container the div for the container of the map widget
 *
 * @constructor
 */
function MapWidget(core,div,placeIndex,title){

    this.core = core;
    this.openlayersMap;
    this.baseLayers;
    this.objectLayer;
	this.placeIndex = placeIndex;
    
    this.drawPolygon;
    this.drawCircle;
    this.selectCountry;
    this.dragArea;
    this.selectFeature;
    this.navigation;
    
    this.div = div;

   	this.gui = new MapGui(this,this.div,title);

    this.initialize();
    
}

MapWidget.prototype = {

    /**
     * initializes the map for the Spatio Temporal Interface.
     * it includes setting up all layers of the map and defines all map specific interaction possibilities
     */
    initialize: function(){

        //OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    	if (STIStatic.proxyHost) {
    		OpenLayers.ProxyHost = STIStatic.proxyHost;
    	}
        var map = this;
                
        this.polygons = [];
        this.connections = [];
        this.selectedObjects = [];
        this.foreignSelection = [];
	this.wmsOverlays = [];

	this.layerZIndex = 1;
	this.zIndices = [];

	var activateDrag = function(){
		map.dragArea.activate();
	}
	var deactivateDrag = function(){
		map.dragArea.deactivate();
	}
	this.dragControl = new MapControl(this,null,'drag',activateDrag,deactivateDrag);
        
        /*
        this.editPolygon = document.createElement("div");
        this.editPolygon.title = STIStatic.getString('editPolygon');
        this.editPolygon.setAttribute('class','editMapPolygon');
        this.toolbar.appendChild(this.editPolygon);
        this.drag.onclick = function(evt){
        	if( map.activeControl == "drag" ){
        		map.deactivate("drag");
        		if( STIStatic.navigate ){
    				map.activate("navigate");
        		}
        	}
        	else {
        		map.deactivate(map.activControl);
        		map.activate("drag");
        	}
        }
        	map.addEditingMode(new OpenLayers.Control.EditingMode.PointArraySnapping());
        	*/
                
        var linkForOsm = 'http://www.openstreetmap.org/';
        var linkForLicense = 'http://creativecommons.org/licenses/by-sa/2.0/';
        this.osmLink = document.createElement("div");
        this.osmLink.setAttribute('class','osmLink');
        this.osmLink.innerHTML = '© <a href='+linkForOsm+'>OpenStreetMap contributors</a>, <a href='+linkForLicense+'>CC-BY-SA</a>';
        this.gui.mapWindow.appendChild(this.osmLink);

	this.filterBar = new FilterBar(this,this.gui.mapWindow);
        
        this.objectLayer = new OpenLayers.Layer.Vector("Data Objects", {
            projection: "EPSG:4326", 'displayInLayerSwitcher':false, rendererOptions: {zIndexing: true}
        });

        this.markerLayer = new OpenLayers.Layer.Markers("Markers");
        
        this.navigation = new OpenLayers.Control.Navigation({
            zoomWheelEnabled: STIStatic.mouseWheelZoom
        });
        this.navigation.defaultDblClick = function(evt){
            var newCenter = this.map.getLonLatFromViewPortPx(evt.xy);
            this.map.setCenter(newCenter, this.map.zoom + 1);
            map.drawObjectLayer(false);
            if( map.zoomSlider ){
            	map.zoomSlider.setValue(map.openlayersMap.getZoom());
            }
        }
        this.navigation.wheelUp = function(evt){

        	this.wheelChange(evt, 1);
            map.drawObjectLayer(false);
            if( map.zoomSlider ){
            	map.zoomSlider.setValue(map.openlayersMap.getZoom());
            }
	}
        this.navigation.wheelDown = function(evt){
        	this.wheelChange(evt, -1);
		map.drawObjectLayer(false);
		if( map.zoomSlider ){
			map.zoomSlider.setValue(map.openlayersMap.getZoom());
		}
	}
         
	this.resolutions = [
		78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625,
		4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891,
		305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066,
		19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254,
		1.194328566789627, 0.5971642833948135, 0.29858214169740677
	];

        var options = {
		controls: [this.navigation, new OpenLayers.Control.ScaleLine() ],
		projection: new OpenLayers.Projection("EPSG:900913"),		
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		resolutions: this.resolutions,
		units: 'meters',
		maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)		
        };
        this.openlayersMap = new OpenLayers.Map("mapContainer", options);
        this.setBaseLayers();
	this.gui.setMapsDropdown();
        this.gui.setMap();
        this.openlayersMap.fractionalZoom = false;
        if( STIStatic.navigate ){
        	this.activeControl = "navigate";
        }
        this.mds = new MapDataSource(this.openlayersMap,this.placeIndex);

    	var boundaries = STIStatic.boundaries;
        var bounds = new OpenLayers.Bounds(boundaries.minLon, boundaries.minLat, boundaries.maxLon, boundaries.maxLat);
        var projectionBounds = bounds.transform(this.openlayersMap.displayProjection, this.openlayersMap.projection);
		this.openlayersMap.zoomToExtent(projectionBounds);
		this.openlayersMap.addLayers([this.objectLayer, this.markerLayer]);

		if( STIStatic.olNavigation ){
			this.zoomPanel = new OpenLayers.Control.ModifiedZoomPanel();
			this.zoomPanel.zoomIn.trigger = function(){
				map.zoom(1);
		    	}
			this.zoomPanel.zoomOut.trigger = function(){
				map.zoom(-1);
		    	}
		    	this.zoomPanel.zoomToMaxExtent.trigger = function() {
				if (this.map) {
					map.zoom(this.map.zoom * -1);
				}
		    	}
			this.openlayersMap.addControl(this.zoomPanel);
			this.openlayersMap.addControl(new OpenLayers.Control.PanPanel());
		}

				
		if( STIStatic.popups ){
			var panMap = function(){
				if( map.selectedGlyph ){
			    		var lonlat = new OpenLayers.LonLat( map.selectedGlyph.lon, map.selectedGlyph.lat );
			    		var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
					if( map.popup ){
				    		map.popup.shift(pixel.x,pixel.y);
					}
				}
			}
			this.openlayersMap.events.register("move",this.openlayersMap,panMap);			
		}

		if( STIStatic.mapOverview ){
			this.openlayersMap.addControl(new OpenLayers.Control.OverviewMap());
		}
		if( STIStatic.keyboardDefaults ){
			this.openlayersMap.addControl(new OpenLayers.Control.KeyboardDefaults());
		}
		if( STIStatic.layerSwitcher ){
		        this.openlayersMap.addControl(new OpenLayers.Control.LayerSwitcher());
		}

		// manages selection of elements if a polygon was drawn        
        this.drawnPolygonHandler = function(polygon){
        	if( map.mds.getAllObjects() == null ){
        		return;
        	}
		var polygonFeature;
            if (polygon instanceof OpenLayers.Geometry.Polygon){
		polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon([polygon]));
            }
            else if (polygon instanceof OpenLayers.Geometry.MultiPolygon){
		polygonFeature = new OpenLayers.Feature.Vector(polygon);
            }
		map.polygons.push(polygonFeature);
		var style = $.extend(true, {}, OpenLayers.Feature.Vector.style['default']);
		style.graphicZIndex = 0;
		polygonFeature.style = style;
            map.objectLayer.addFeatures([polygonFeature]);
//            placeToolbar();
	try {
            map.activeControl.deactivate();
	}
	catch(e){}
            var circles = map.mds.getObjectsByZoom();
		for (var i = 0; i < circles.length; i++){
		    for (var j = 0; j < circles[i].length; j++){
		    	var c = circles[i][j];
		    	if( map.inPolygon(c) ){
		    		c.setSelection(true);
		    	}
		    }
		}
            map.mapSelection();
			//map.drilldownLayer.setZIndex(parseInt(map.objectLayer.getZIndex())+1);
        }        
        
	this.polygonDeselection = function(){
            var circles = map.mds.getObjectsByZoom();
		for (var i = 0; i < circles.length; i++){
		    for (var j = 0; j < circles[i].length; j++){
		    	var c = circles[i][j];
		    	if( map.inPolygon(c) ){
		    		c.setSelection(false);
		    	}
		    }
		}
	}

		// resets the core
        this.snapper = function(){
		if( map.polygons.length == 0 || !STIStatic.multiSelection ){
			map.deselection();
		}
        }

		if( STIStatic.polygonSelect ){
	        this.drawPolygon = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.Polygon, {
	            displayClass: "olControlDrawFeaturePolygon",
	            callbacks: {
	                "done": map.drawnPolygonHandler,
	                "create": map.snapper
	            }
	        });
	        this.openlayersMap.addControl(this.drawPolygon);
        }

		if( STIStatic.circleSelect ){
	        this.drawCircle = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.RegularPolygon, {
	            displayClass: "olControlDrawFeaturePolygon",
	            handlerOptions: {
	                sides: 40
	            },
	            callbacks: {
	                "done": map.drawnPolygonHandler,
	                "create": map.snapper
	            }
	        });
	        this.openlayersMap.addControl(this.drawCircle);
        }
        
	if( STIStatic.squareSelect ){        
	        this.drawSquare = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.RegularPolygon, {
	            displayClass: "olControlDrawFeaturePolygon",
	            handlerOptions: {
	                sides: 4
	            },
	            callbacks: {
	                "done": map.drawnPolygonHandler,
	                "create": map.snapper
	            }
	        });
	        this.openlayersMap.addControl(this.drawSquare);
        }

	if( STIStatic.polygonSelect || STIStatic.circleSelect || STIStatic.squareSelect ){
	        this.dragArea = new OpenLayers.Control.DragFeature(map.objectLayer, {
	        	onStart: function(feature){
				feature.style.graphicZIndex = 10000;
				map.polygonDeselection();
	        	},
	            onComplete: function(feature){
			feature.style.graphicZIndex = 0;
	                map.drawnPolygonHandler(feature.geometry);
	            }
	        });
	        this.openlayersMap.addControl(this.dragArea);

	        this.modifyArea = new OpenLayers.Control.ModifyFeature(map.objectLayer, {
	        	onStart: function(feature){
				feature.style.graphicZIndex = 10000;
				map.polygonDeselection();
	        	},
	            onComplete: function(feature){
			feature.style.graphicZIndex = 0;
	                map.drawnPolygonHandler(feature.geometry);
	            }
	        });
	        this.openlayersMap.addControl(this.modifyArea);
		this.modifyArea.mode = OpenLayers.Control.ModifyFeature.RESHAPE;

        }

	// calculates the tag cloud
	// manages hover selection of point objects
        var hoverSelect = function(event){
		var object = event.feature;
		if( object.geometry instanceof OpenLayers.Geometry.Point ){
			var circle = event.feature.parent;
			circle.placenameTags = new PlacenameTags(circle,map);
			circle.placenameTags.calculate();
			map.mapCircleHighlight(object.parent,false);
			map.hoverCircle = circle;
			if( typeof map.featureInfo != 'undefined' ){
				map.featureInfo.deactivate();
			}
		}
		else {
			map.dragControl.checkStatus();
		}
        };
        var hoverUnselect = function(event){
		var object = event.feature;
		if( object.geometry instanceof OpenLayers.Geometry.Point ){
			var circle = event.feature.parent;
			circle.placenameTags.remove();
			map.hoverCircle = undefined;
			map.mapCircleHighlight(object.parent,true);
			if( typeof map.featureInfo != 'undefined' ){
				map.featureInfo.activate();
			}
		}
		else {
			map.dragControl.deactivate();
		}
        };
        var highlightCtrl = new OpenLayers.Control.SelectFeature(this.objectLayer, {
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary",
            eventListeners: {
                featurehighlighted: hoverSelect,
                featureunhighlighted: hoverUnselect
            }
        });
        this.openlayersMap.addControl(highlightCtrl);
        highlightCtrl.activate();
        
        this.selectFeature = new OpenLayers.Control.SelectFeature(this.objectLayer);

	document.onkeydown = function(e){
		if( e.ctrlKey ){
			map.ctrlKey = true;
		}
	}
	document.onkeyup = function(e){
		map.ctrlKey = false;
	}

	// manages click selection of point objects
        var onFeatureSelect = function(event,evt){
		if( !(event.feature.geometry instanceof OpenLayers.Geometry.Point) ){
			return;
		}
            	var circle = event.feature.parent;
		if( STIStatic.individualSelection && map.ctrlKey ){
			if( map.popup ){
       				map.popup.reset();
				map.selectedGlyph = false;
		        }
			circle.toggleSelection();
			map.mapSelection();
			return;
		}
        	map.reset();
		circle.setSelection(true);
//        	map.placenameTags = new PlacenameTags(circle,map);
//        	map.placenameTags.calculate();
	        map.objectLayer.drawFeature(circle.feature);
        	if( STIStatic.popups ){
			if( map.popup ){
       				map.popup.reset();
			}
        		var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
        		var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
			map.selectedGlyph = {
				lon: lonlat.lon,
				lat: lonlat.lat
			};
	                map.popup = new PlacenamePopup(map);
			map.popup.createPopup(pixel.x,pixel.y,circle.placenameTags.placeLabels);
                	if( STIStatic.selectDefault ){
                    		circle.placenameTags.selectLabel();
                	}
        	}
        	else {
    			map.openlayersMap.setCenter(event.feature.geometry.getBounds().getCenterLonLat());
    			map.placeTagCloud(point);
//    			placeToolbar();
                	if( STIStatic.selectDefault ){
                    		circle.placenameTags.selectLabel();
                	}
        	}
        }
        this.objectLayer.events.on({ "featureselected": onFeatureSelect });

        this.openlayersMap.addControl(this.selectFeature);
        this.selectFeature.activate();
		
        if( this.zoomSlider ){
			this.zoomSlider.setMaxAndLevels(1000,this.openlayersMap.getNumZoomLevels());
			this.zoomSlider.setValue(this.openlayersMap.getZoom());
        }
        
    },
    
    shift: function(shiftX,shiftY){
		this.openlayersMap.pan(shiftX,shiftY);
    },

	addBaseLayers: function(layers){
		if( layers instanceof Array ){
			for( var i in layers ){		
				var layer = new OpenLayers.Layer.WMS(layers[i].name,
					layers[i].url,
				    	{
						projection: "EPSG:4326",
						layers: layers[i].layer,
						transparent: "true",
						format: "image/png"
					},
					{
						isBaseLayer: true
					}
				);
				this.baseLayers.push(layer);
				this.openlayersMap.addLayers([layer]);
			}
		}
		this.gui.setMapsDropdown();
	},

	/**
	 * set online available maps for Google, Bing and OSM
	*/
	setBaseLayers: function(){
		this.baseLayers = [];
		if( STIStatic.googleMaps ){
			// see http://openlayers.org/blog/2010/07/10/google-maps-v3-for-openlayers/ for information
	        	this.baseLayers.push( new OpenLayers.Layer.Google("Google Physical", { type: google.maps.MapTypeId.TERRAIN } ) );
			this.baseLayers.push( new OpenLayers.Layer.Google( 'Google Streets' ) );
			this.baseLayers.push( new OpenLayers.Layer.Google( 'Google Satellite', { type: google.maps.MapTypeId.HYBRID } ) );
			this.baseLayers.push( new OpenLayers.Layer.Google( 'Google Hybrid', { type: google.maps.MapTypeId.SATELLITE } ) );
		}		
		if( STIStatic.bingMaps ){
			// see http://openlayers.org/blog/2010/12/18/bing-tiles-for-openlayers/ for information
			var apiKey = STIStatic.bingApiKey;
			this.baseLayers.push( new OpenLayers.Layer.Bing({ key: apiKey, type: "Road" }) );
	        	this.baseLayers.push( new OpenLayers.Layer.Bing({ key: apiKey, type: "Aerial"}) );
	        	this.baseLayers.push( new OpenLayers.Layer.Bing({ key: apiKey, type: "AerialWithLabels", name: "Bing Aerial With Labels"}) );
        	}
		if( STIStatic.osmMaps ){
			this.baseLayers.push( new OpenLayers.Layer.OSM( 'Open Street Map', '',
			{ sphericalMercator: true,zoomOffset: 1, resolutions: this.resolutions } ) );
		}
		for( var i=0; i<this.baseLayers.length; i++ ){
			this.openlayersMap.addLayers([this.baseLayers[i]]);
		}
		if( STIStatic.alternativeMap ){
			this.addBaseLayers([STIStatic.alternativeMap]);
		}
		for( var i=0; i<this.baseLayers.length; i++ ){
			if( this.baseLayers[i].name == STIStatic.baseLayer ){
				this.setMap(i);
			}
		}
	},
    
    getBaseLayerName: function(){
    	return this.openlayersMap.baseLayer.name;
    },

    setOverlays: function(layers){
	for( var i in this.wmsOverlays ){
		this.openlayersMap.removeLayer(this.wmsOverlays[i]);
	}
	this.wmsOverlays = [];
	var featureInfoLayers = [];
	if( layers instanceof Array ){
		for( var i in layers ){		
			var layer = new OpenLayers.Layer.WMS(layers[i].name,
				layers[i].url,
			    	{
					projection: "EPSG:4326",
					layers: layers[i].layer,
					transparent: "true",
					format: "image/png"
				},
				{
					isBaseLayer: false,
					visibility: STIStatic.overlayVisibility //vhz change true for a parameter of the stistatic
				}
			);
			this.wmsOverlays.push(layer);
			if( layers[i].featureInfo ){
				featureInfoLayers.push(layer);
			}
		}
		this.openlayersMap.addLayers(this.wmsOverlays);
	}
	if( this.wmsOverlays.length > 0 && STIStatic.overlayVisibility){
		var map = this;
		if( typeof this.featureInfo != 'undefined' ){
			this.featureInfo.deactivate();
			this.openlayersMap.removeControl(this.featureInfo);
		}
		this.featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
			url: '/geoserver/wms',
			layers: featureInfoLayers,
			eventListeners: {
				getfeatureinfo: function(event){
					if( event.text == '' ){
						return;
					}
					var lonlat = map.openlayersMap.getLonLatFromPixel( new OpenLayers.Pixel(event.xy.x,event.xy.y) );
					map.selectedGlyph = {
						lon: lonlat.lon,
						lat: lonlat.lat
					};					
					if( typeof map.popup != 'undefined' ){
						map.popup.reset();
					}
					map.popup = new Popup(map);
					map.popup.initialize(event.xy.x,event.xy.y,event.text);
				}
			}
		});
		this.openlayersMap.addControl(this.featureInfo);
		this.featureInfo.activate();
		this.activateCountrySelector(this.wmsOverlays[this.wmsOverlays.length-1]);
	}
	else {
		this.deactivateCountrySelector();
		if( this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS ){
       			this.activateCountrySelector(this.openlayersMap.baseLayer);
		}
	}
    },

    addBaseLayer: function(layer){
	this.baseLayers.push(layer);
	this.openlayersMap.addLayers([layer]);
	for( var i in this.baseLayers ){
		if( this.baseLayers[i].name == STIStatic.baseLayer ){
			this.setMap(i);
		}
	}
    },
    
    /**
     * draws the object layer.
	 * @param {boolean} zoom if there was a zoom; if not, the new boundary of the map is calculated
     */
    drawObjectLayer: function(zoom){
    	var points = this.mds.getAllObjects();
		if( points == null ){
			return;
		}
        this.objectLayer.removeAllFeatures();
	try {
		this.deselection();
	}
	catch(e){}
        if (zoom) {
            var minLat, maxLat, minLon, maxLon;
            var pointsHighestZoom = points[points.length-1];
            for (var i = 0; i < pointsHighestZoom.length; i++) {
                for (var j = 0; j < pointsHighestZoom[i].length; j++) {
                    var point = pointsHighestZoom[i][j];
                    if (minLon == null || point.originX < minLon){
                        minLon = point.originX;
                    }
                    if (maxLon == null || point.originX > maxLon){
                        maxLon = point.originX;
                    }
                    if (minLat == null || point.originY < minLat){
                        minLat = point.originY;
                    }
                    if (maxLat == null || point.originY > maxLat){
                        maxLat = point.originY;
                    }
                }
            }
            if (minLon == maxLon && minLat == maxLat) {
                this.openlayersMap.setCenter(new OpenLayers.LonLat(minLon, minLat));
            }
            else {
            	var gapX = 0.1 * ( maxLon - minLon );
            	var gapY1 = 0.1 * ( maxLat - minLat );
            	var gapY2 = ( this.gui.headerHeight / this.gui.mapWindow.offsetHeight + 0.1 ) * ( maxLat - minLat );
                this.openlayersMap.zoomToExtent(new OpenLayers.Bounds(minLon-gapX, minLat-gapY1, maxLon+gapX, maxLat+gapY2));
                this.openlayersMap.zoomTo(Math.floor(this.openlayersMap.getZoom()));
            }
            if( this.zoomSlider ){
            	this.zoomSlider.setValue(this.openlayersMap.getZoom());
            }
        }
        var displayPoints = this.mds.getObjectsByZoom();
    	var resolution = this.openlayersMap.getResolution();
        for (var i = 0; i < displayPoints.length; i++) {
        	for (var j = 0; j < displayPoints[i].length; j++) {
		    	var p = displayPoints[i][j];
		    	var x = p.originX + resolution * p.shiftX; 
		    	var y = p.originY + resolution * p.shiftY;
		    	p.feature.geometry.x = x;
		    	p.feature.geometry.y = y;
		    	p.olFeature.geometry.x = x;
		    	p.olFeature.geometry.y = y;
			p.feature.style.graphicZIndex = this.zIndices[i];
			p.olFeature.style.graphicZIndex = this.zIndices[i] + 1;
		        this.objectLayer.addFeatures([p.feature]);
		        this.objectLayer.addFeatures([p.olFeature]);
        	}
        }
        
        var dist = function(p1,p2){
        	return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
        }
                
        if( this.foreignSelection.length > 0 ){
        	this.highlightChanged(this.foreignSelection);        	
        }

		if( typeof this.hoverCircle != 'undefined' ){
			this.hoverCircle.placenameTags.remove();
		}

    },

	riseLayer: function(id){
		this.lastId = id;
		if( typeof id == 'undefined' ){
			id = this.lastId || 0;
		}
		this.zIndices[id] = this.layerZIndex;
		this.layerZIndex += 2;
		this.reset();
		this.drawObjectLayer(false);
	},

	/**
	 * initializes the object layer.
	 * all point representations for all zoom levels are calculated and initialized
	 * @param {MapObject[][]} mapObjects an array of map objects from different (1-4) sets
	*/
	initMap: function(mapObjects,zoom){

		this.clearMap();

		if( typeof mapObjects == 'undefined' ){
			return;
		}

		this.mapObjects = mapObjects;
		this.count = 0;
		this.objectCount = 0;
		for (var i = 0; i < mapObjects.length; i++) {
			var c = 0;
			for (var j = 0; j < mapObjects[i].length; j++) {
				c += mapObjects[i][j].weight;
				this.objectCount++;
			}
			this.count += c;
			this.zIndices.push(this.layerZIndex);
			this.layerZIndex += 2;
		}

		this.mds.initialize(mapObjects);
		var points = this.mds.getAllObjects(); 
		if( points == null ){
			return;
		}
            		
		for(var i = 0; i < points.length; i++){
			var area = 0;
			var maxRadius = 0;
			for(var j = 0; j < points[i].length; j++){
				for(var k = 0; k < points[i][j].length; k++){
					if( points[i][j][k].radius > maxRadius ){
						maxRadius = points[i][j][k].radius;
						area = STIStatic.getArea(maxRadius);
					}
				}
			}
			var minArea = STIStatic.getArea(STIStatic.minimumRadius);
			var areaDiff = area - minArea;
			for(var j = 0; j < points[i].length; j++){
				for(var k = 0; k < points[i][j].length; k++){
					var point = points[i][j][k];
					var c = STIStatic.colors[point.search];
					var transparency = 1;
					if( STIStatic.circleTransparency ){
						var min = STIStatic.minTransparency;
						var max = STIStatic.maxTransparency;
						transparency = min + Math.abs(min-max) * (1-(STIStatic.getArea(point.radius)-minArea)/areaDiff);
					}
					transparency = 0.6;
					var style = {
						fillColor: 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')',
						fillOpacity: transparency,
						strokeWidth: 2,
						strokeColor: 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
						stroke: STIStatic.circleOutline,
						pointRadius: point.radius,
						cursor: "pointer"
					};
					var pointGeometry = new OpenLayers.Geometry.Point(point.originX, point.originY, null);
					var feature = new OpenLayers.Feature.Vector(pointGeometry);
					feature.style = style;
					feature.parent = point;
					point.setFeature(feature);
					var olStyle = {
						fillColor: 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
						fillOpacity: transparency,
						stroke: false,
						pointRadius: 0,
						cursor: "pointer"
					};
					var olPointGeometry = new OpenLayers.Geometry.Point(point.originX, point.originY, null);
					var olFeature = new OpenLayers.Feature.Vector(olPointGeometry);
					olFeature.style = olStyle;
					olFeature.parent = point;
					point.setOlFeature(olFeature);
				}
			}
		}
    	
		if( typeof zoom == "undefined" ){
	        	this.drawObjectLayer(true);
		}
		else {
        		this.drawObjectLayer(zoom);
		}
		this.gui.updateSpaceQuantity(this.count);

	},

	setFilterBar: function(filterBar){
		this.filterBar = filterBar;
	},
    
    /**
     * resets the map by destroying all additional elements except the point objects, which are replaced
     */
    reset: function(){
	this.objectLayer.removeFeatures(this.polygons);
	this.polygons = [];
	this.objectLayer.removeFeatures(this.connections);
	this.connections = [];
	this.selectFeature.unselectAll();
	this.selectedGlyph = false;
        if( this.dragControl.activated ){
  		this.dragControl.deactivate();
	}
        if( this.popup ){
        	this.popup.reset();
        }
    	this.selectedObjects = [];
    	this.foreignSelection = [];
	this.filterBar.reset(false);
        var points = this.mds.getObjectsByZoom();
    	if( points == null ){
    		return;
    	}
    	for (var i = 0; i < points.length; i++){
            for (var j = 0; j < points[i].length; j++){
		points[i][j].setSelection(false);
            }
    	}
    },
    
    /**
     * resets the map by destroying all elements
     */
    clearMap: function(){
    	this.reset();
	this.zIndices = [];
	this.layerZIndex = 1;
        this.objectLayer.destroyFeatures();
    },
    
    /**
     * updates the proportional selection status of a point object
     * @param {PointObject} point the point to update
     * @param {OpenLayers.Geometry.Polygon} polygon the actual displayed map polygon
     */
    updatePoint: function(point,polygon){
		var feature = point.feature;
		var olFeature = point.olFeature;
		var drawFeature = false, drawOlFeature = false;
		var olRadius = STIStatic.getRadius(point.overlay,this.openlayersMap.zoom+1);
		if( olRadius != olFeature.style.pointRadius ){
			olFeature.style.pointRadius = olRadius;
			drawOlFeature = true;
		}
		if( point.setPercentage() ){
			var c = STIStatic.colors[point.search];
			var p = point.percentage;
			var r = c.r0 + Math.round(p * (c.r1 - c.r0));
			var g = c.g0 + Math.round(p * (c.g1 - c.g0));
			var b = c.b0 + Math.round(p * (c.b1 - c.b0));
			feature.style.fillColor = 'rgb('+r+','+g+','+b+')';
			drawFeature = true;
		}
		if( polygon.containsPoint(feature.geometry) ){
			if( drawFeature ){
				this.objectLayer.drawFeature(feature);
			}
			if( drawFeature || drawOlFeature ){
				this.objectLayer.drawFeature(olFeature);
			}
		}
    },    
    
    /**
     * updates the the object layer of the map after selections had been executed in timeplot or table or zoom level has changed
     */
    highlightChanged: function(mapObjects){
    	if( this.selectedObjects.length == 0 ){
        	this.mds.setSelection(this.selectedObjects,false);
    	}
    	else {
        	this.mds.setSelection(this.selectedObjects,true);
    	}
    	this.mds.setOverlay(mapObjects);
        var points = this.mds.getObjectsByZoom();
        var polygon = this.openlayersMap.getExtent().toGeometry();
        for( var i in points ){
            for( var j in points[i] ){
            	this.updatePoint(points[i][j],polygon);
            }
        }
       	this.displayConnections();
    },
    
    selectionChanged: function(mapObjects){
    	this.reset();
    	this.foreignSelection = mapObjects;
       	this.highlightChanged(mapObjects);
    },
    
    inPolygon: function(point){
        for (var i = 0; i < this.polygons.length; i++){
		var polygon = this.polygons[i].geometry;
	        for (var j = 0; j < polygon.components.length; j++){
		    if (polygon.components[j].containsPoint(point.feature.geometry)) {
		        return true;
		    }
		}
        }
        return false;
    },
    
    mapSelection: function(){
    	this.selectedObjects = [];
		for( var i=0; i<this.mds.size(); i++ ){
			this.selectedObjects.push([]);
		}
        var circles = this.mds.getObjectsByZoom();
        for (var i = 0; i < circles.length; i++){
            for (var j = 0; j < circles[i].length; j++){
            	var c = circles[i][j];
		if( c.selected ){
            		this.selectedObjects[i] = this.selectedObjects[i].concat(c.elements);
		}
            }
        }
        this.highlightChanged([]);
	this.core.triggerSelection( [{ value: 1, objects: this.selectedObjects }], 'map' );
	this.filterBar.reset(true);
    },
    
    deselection: function(){
    	this.mds.setSelection(this.selectedObjects,false);
    	this.reset();
    	this.highlightChanged([]);
    	this.core.triggerSelection([],'map');
    },

    filtering: function(){
	this.core.triggerRefining(this.selectedObjects);
    },

    inverseFiltering: function(){
    	this.selectedObjects = [];
	for( var i=0; i<this.mds.size(); i++ ){
		this.selectedObjects.push([]);
	}
        var circles = this.mds.getObjectsByZoom();
        for (var i = 0; i < circles.length; i++){
            for (var j = 0; j < circles[i].length; j++){
            	var c = circles[i][j];
		if( !c.selected ){
            		this.selectedObjects[i] = this.selectedObjects[i].concat(c.elements);
		}
            }
        }
	this.filtering();
    },
    
    mapCircleHighlight: function(circle,undo){
		if( this.polygons.length > 0 && this.inPolygon(circle) ){
			return;
		}
		var mapObjects = [];
		if( !undo && !circle.selected) {
			for( var i=0; i<this.mds.size(); i++ ){
				mapObjects.push([]);
			}
			mapObjects[circle.search] = circle.elements;
		}
	        this.objectLayer.drawFeature(circle.feature);
		var objects = [];		
		if( this.selectedObjects.length > 0 ){
			objects.push({ value: 1, objects: this.selectedObjects });
		}
		if( mapObjects.length > 0 ){
			objects.push({ value: 1, objects: mapObjects });
		}
		this.core.triggerHighlight(objects,'map');
    },
    
    mapLabelSelection: function(label){
    	this.mds.setSelection(this.selectedObjects,false);
    	this.selectedObjects = [];
		for( var i=0; i<this.mds.size(); i++ ){
			this.selectedObjects.push([]);
		}
		this.selectedObjects[label.index] = label.elements;
	        this.highlightChanged([]);
		this.core.triggerSelection( [{ value: 1, objects: this.selectedObjects }], 'label' );
	this.filterBar.reset(true);
    },
    
    mapLabelHighlight: function(label,undo){
    	if( this.placenameTags.selectedLabel == this.placenameTags.allLabel ){
    		return;
    	}
    	if( undo ){
    		this.core.triggerHighlight( [{ value: 1, objects: this.selectedObjects }], 'label' );
    	}
    	else {
    		var mapObjects = [];
    		for( var i=0; i<this.mds.size(); i++ ){
    			mapObjects.push([]);
    		}
    		mapObjects[label.index] = label.elements;
    		this.core.triggerHighlight( [{ value: 1, objects: mapObjects }].concat( [{ value: 1, objects: this.selectedObjects }] ), 'label' );
    	}
    },
    
    /**
     * displays connections between data objects
     */
    displayConnections: function(){
	return;
	if( typeof this.connection != 'undefined' ){
		this.objectLayer.removeFeatures(this.connections);
		this.connections = [];
	}
	if( STIStatic.connections ){
		var points = this.mds.getObjectsByZoom();
		for( var i in points ){
		    for( var j in points[i] ){

		    }
		}

            var slices = this.core.timeplot.getSlices();
            for (var i = 0; i < slices.length; i++) {
                for (var j = 0; j < slices[i].stacks.length; j++) {
                	var e = slices[i].stacks[j].elements; 
                    if (e.length == 0){
                        continue;
                    }
                    var points = [];
                    for (var k = 0; k < e.length; k++) {
                    	var point = this.mds.getCircle(j,e[k].index).feature.geometry;                	
                    	if( arrayIndex(points,point) == -1 ){
                   			points.push(point);
                    	}
                    }
                    var matrix = new AdjMatrix(points.length);
                    for (var k = 0; k < points.length-1; k++) {
                    	for (var l = k+1; l < points.length; l++) {
                        	matrix.setEdge(k,l,dist(points[k],points[l]));
                        }
                    }
    				var tree = Prim(matrix);
    				var lines = [];
    				for( var z=0; z<tree.length; z++ ){
    					lines.push(new OpenLayers.Geometry.LineString(new Array(points[tree[z].v1],points[tree[z].v2])));
    				}
                    this.connections[j].push({
                    	first: this.mds.getCircle(j,e[0].index).feature.geometry,
                    	last: this.mds.getCircle(j,e[e.length-1].index).feature.geometry,
                        lines: lines,
                        time: slices[i].date
                    });
                }
            }
        var ltm = this.core.timeplot.leftFlagTime;
        var rtm = this.core.timeplot.rightFlagTime;
        if (ltm == undefined || ltm == null){
            return;
		}
        else {
            ltm = ltm.getTime();
            rtm = rtm.getTime();
        }
//        this.connectionLayer.destroyFeatures();
        if (thisConnections) {
            for (var i = 0; i < this.connections.length; i++) {
                var c = STIStatic.colors[i];
                var style = {
                    strokeColor: 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
                    strokeOpacity: 0.5,
                    strokeWidth: 3	
                };
                var pointsToConnect = [];
                var last = undefined;
                for (var j = 0; j < this.connections[i].length; j++) {
                	var c = this.connections[i][j];
                    var ct = c.time.getTime();
					if (ct >= ltm && ct <= rtm) {
						if( last != undefined ){
                			var line = new OpenLayers.Geometry.LineString(new Array(last,c.first));
                			this.connectionLayer.addFeatures([new OpenLayers.Feature.Vector(line, null, style)]);
						}
						for( var k=0; k<c.lines.length; k++ ){
                			this.connectionLayer.addFeatures([new OpenLayers.Feature.Vector(c.lines[k], null, style)]);							
						}
						last = c.last;
                    }
                }
            }
//            this.connectionLayer.redraw();
        }
        }
    },
	
    /**
     * performs a zoom on the map
     * @param {int} delta the change of zoom levels
     */
	zoom: function( delta ){
		var zoom = this.openlayersMap.getZoom() + delta;
		if( this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS ){
			this.openlayersMap.zoomTo(zoom);	
		}
		else {
			this.openlayersMap.zoomTo(Math.round(zoom));
			if( this.zoomSlider ){
				this.zoomSlider.setValue(this.openlayersMap.getZoom());
			}
		}
		this.drawObjectLayer(false);
		return true;
	},

	deactivateCountrySelector: function(){
		this.openlayersMap.removeControl(this.selectCountry);
		this.selectCountry = undefined;
	},

	activateCountrySelector: function(layer){
		var map = this;
		if( STIStatic.countrySelect && STIStatic.mapSelectionTools ){
			this.selectCountry = new OpenLayers.Control.GetFeature({
			    	protocol: OpenLayers.Protocol.WFS.fromWMSLayer(layer),
			    	click: true
			});
			this.selectCountry.events.register("featureselected", this, function(e){
				map.snapper();
				map.drawnPolygonHandler(e.feature.geometry);
			});
			this.openlayersMap.addControl(this.selectCountry);
			this.countrySelectionControl.enable();
		}
	},
	
	setMap: function(index){
		this.baselayerIndex = index;
		if( this.selectCountry ){
//			if( this.wmsOverlays.length == 0 ){
				this.deactivateCountrySelector();
//			}
		}
		if (this.baseLayers[index] instanceof OpenLayers.Layer.WMS) {
			if( STIStatic.fractionalZoom ){
				this.openlayersMap.fractionalZoom = true;
			}
//			if( this.wmsOverlays.length == 0 ){
				this.activateCountrySelector(this.baseLayers[index]);
//			}
		}
		else {
			this.openlayersMap.fractionalZoom = false;
			if( this.countrySelectionControl ){
		        	this.countrySelectionControl.disable();
			}
		}
		this.openlayersMap.zoomTo(Math.floor(this.openlayersMap.getZoom()));
		this.openlayersMap.setBaseLayer(this.baseLayers[index]);
		if( this.baseLayers[index].name == 'Open Street Map' ){
			this.osmLink.style.visibility = 'visible';
		}
		else {
			this.osmLink.style.visibility = 'hidden';
		}
	},

	//vhz added title to buttons
	initSelectorTools: function(){
		var map = this;
		this.mapControls = [];
		
		if( STIStatic.squareSelect ){
			var button = document.createElement("div");
			$(button).addClass('mapControl');			
			var activate = function(){
				map.drawSquare.activate();
			}
			var deactivate = function(){
				map.drawSquare.deactivate();
			}
			this.mapControls.push(new MapControl(this,button,'square',activate,deactivate));
		}
		if( STIStatic.circleSelect ){
			var button = document.createElement("div");
			$(button).addClass('mapControl');			
			var activate = function(){
				map.drawCircle.activate();
			}
			var deactivate = function(){
				map.drawCircle.deactivate();
			}
			this.mapControls.push(new MapControl(this,button,'circle',activate,deactivate));
		}
		if( STIStatic.polygonSelect ){
			var button = document.createElement("div");
			$(button).addClass('mapControl');			
			var activate = function(){
				map.drawPolygon.activate();
			}
			var deactivate = function(){
				map.drawPolygon.deactivate();
			}
			this.mapControls.push(new MapControl(this,button,'polygon',activate,deactivate));
		}
		if( STIStatic.countrySelect ){
			var button = document.createElement("div");
			$(button).addClass('mapControl');			
			var activate = function(){
				map.selectCountry.activate();
				map.dragControl.disable();
			}
			var deactivate = function(){
				map.selectCountry.deactivate();
				map.dragControl.enable();
			}
			this.countrySelectionControl = new MapControl(this,button,'country',activate,deactivate);
			this.mapControls.push(this.countrySelectionControl);
/*
    			if( !(this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS) ){
        			this.countrySelectionControl.disable();
    			}
*/
    		}
		return this.mapControls;
	},
    
	
	getZoom: function(){
		return this.openlayersMap.getZoom();
	},
	
	setMarker: function(lon,lat){
		var p = new OpenLayers.Geometry.Point(lon,lat,null);
       	p.transform(this.openlayersMap.displayProjection,this.openlayersMap.projection);
		this.openlayersMap.setCenter(new OpenLayers.LonLat(p.x,p.y));
		var size = new OpenLayers.Size(22,33);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon(STIStatic.path+'marker.png', size, offset);
		var marker = new OpenLayers.Marker(new OpenLayers.LonLat(p.x,p.y),icon);
		marker.setOpacity(0.9);
		this.markerLayer.setZIndex(parseInt(this.objectLayer.getZIndex())+1);
		this.markerLayer.addMarker(marker);
		// find nearest neighbor
		var nearestNeighbor;
        var points = this.mds.getAllObjects(); 
    	if( points == null ){
    		return;
    	}
        var dist = function(p1,p2){
        	return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
        }
        var zoomLevels = this.openlayersMap.getNumZoomLevels();
    	var pointSet = points[zoomLevels-1];
    	var closestDistance = undefined;
    	var closestPoint;
    	for (var i = 0; i < pointSet.length; i++){
	    	for (var j = 0; j < pointSet[i].length; j++){
	    		var point = pointSet[i][j].feature.geometry;
	    		var d = dist(point,p);	    		
	    		if( !closestDistance || d < closestDistance ){
	    			closestDistance = d;
	    			closestPoint = point;
	    		}
	    	}
    	}
    	// find minimal zoom level
    	var gap = 0;
    	var x_s = this.gui.mapWindow.offsetWidth / 2 - gap;
    	var y_s = this.gui.mapWindow.offsetHeight / 2 - gap;
    	var xDist = Math.abs(p.x - closestPoint.x);
    	var yDist = Math.abs(p.y - closestPoint.y);
    	for (var i = 0; i < zoomLevels; i++){
    		var resolution = this.openlayersMap.getResolutionForZoom(zoomLevels - i - 1);
    		if( xDist/resolution < x_s && yDist/resolution < y_s ){
    			this.openlayersMap.zoomTo(zoomLevels - i - 1);
    			if( this.zoomSlider ){
    				this.zoomSlider.setValue(this.openlayersMap.getZoom());
    			}
    			this.drawObjectLayer(false);
    			break;
    		}
    	}
	},
	
	removeMarker: function(){
	        this.markerLayer.removeMarker(this.markerLayer.markers[0]);
	},
	
	getLevelOfDetail: function(){
		var zoom = Math.floor(this.openlayersMap.getZoom());
		if( zoom <= 1 ){
			return 0;
		}
		else if( zoom <= 3 ){
			return 1;
		}
		else if( zoom <= 8 ){
			return 2;
		}
		else {
			return 3;
		}
	}
	
}
