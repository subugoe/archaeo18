/*
* view to show single images
*/
Images = function(doc,container,parent){

	this.type = "images";
	this.path = doc.imagePath;
	this.images = doc.images;
	this.pages = doc.pages;
	this.actualPage;

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	var context = this;
	var trigger = function(page){
		context.showPage(page);
		parent.pageChanged(page);
	}
	parent.paginator.setTriggerFunc(trigger);
	parent.showPagination();

	/*
	* show image of a given <page> with openlayers
	*/
	this.showPage = function(page){
		if( contentPanel.width() == 0 ){
			return;
		}
		if( this.actualPage != page ){
			this.zoom = 0;
			this.center = undefined;
		}
		this.actualPage = page;
		var doc = this;
		contentPanel.empty();
		var width = contentPanel.width()-4;
		var height = contentPanel.height()-4;
		var url = this.path+"1200/"+this.images[page-1];
		parent.startProcessing();
		var mapId = a18Gui.getIndependentId();
		var zoomDiv = $("<div id='imageZoom"+mapId+"'/>").appendTo(contentPanel);
		zoomDiv.css('width',width+'px');
		zoomDiv.css('height',height+'px');
		zoomDiv.css('position','relative');
		this.map = new OpenLayers.Map("imageZoom"+mapId, { fractionalZoom: true } );
		var navi = new OpenLayers.Control.Navigation();
		navi.wheelChange = function(evt, deltaZ){
			if( doc.zoom == 0 && deltaZ < 0 ){
				return;
			}
			var zf = a18Props.fractionalZoomFactor;
			var newZoom = Math.round( ( doc.zoom + deltaZ*zf ) * 10 ) / 10;
			doc.zoom = newZoom;	
			if (!this.map.isValidZoomLevel(newZoom)) {
			    return;
			}
			var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
			var size    = this.map.getSize();
			var deltaX  = size.w/2 - evt.xy.x;
			var deltaY  = evt.xy.y - size.h/2;
			var newRes  = this.map.baseLayer.getResolutionForZoom(newZoom);
			var x = zoomPoint.lon + deltaX * newRes;
			var y = zoomPoint.lat + deltaY * newRes;
			this.map.setCenter( new OpenLayers.LonLat(x,y), newZoom );
			doc.center = { x: x, y: y };
		};
		navi.defaultDblClick = function(evt){
		    var newCenter = this.map.getLonLatFromViewPortPx(evt.xy);
		    this.map.setCenter(newCenter, this.map.zoom + 1);
		    doc.zoom += 1;
		}
		this.map.zoomIn = function() {
			doc.zoom++;
        		this.zoomTo(doc.zoom);
    		}
		this.map.zoomOut = function() {
			if( doc.zoom > 1 ){
				doc.zoom--;
			}
			else {
				doc.zoom = 0;
			}
        		this.zoomTo(doc.zoom);
    		}
		this.map.zoomToMaxExtent = function(options) {
		        var restricted = (options) ? options.restricted : true;
			var maxExtent = this.getMaxExtent({
			    'restricted': restricted 
			});
			this.zoomToExtent(maxExtent);
			doc.zoom = 0;
		}
		this.map.addControl(navi);
		var graphic = new Image();
		graphic.onerror = function(){
			contentPanel.empty();
			$(Util.getErrorMessage(404)).appendTo(contentPanel);
			parent.stopProcessing();
		}
		graphic.onload = function(){
   			var w = graphic.naturalWidth || this.width;
   			var h = graphic.naturalHeight || this.height;
   			var ws, hs;
   			if( height/h*w < width ){
   				hs = height;
   				ws = height/h*w;
   			}
   			else {
   				ws = width;
   				hs = width/w*h;       				
   			}
  	   		var imageLayer = new OpenLayers.Layer.Image(
   	   				'Page '+page,
   	   				url,
   	   				new OpenLayers.Bounds(-w/2, -h/2, w, h),
   	   				new OpenLayers.Size(ws,hs),
					{isBaseLayer: true, displayInLayerSwitcher: false}
   	   		);
   	   		doc.map.addLayer(imageLayer);
			if( typeof doc.initialZoom != 'undefined' ){
				doc.map.zoomTo(doc.initialZoom);
				doc.zoom = doc.initialZoom;
				doc.initialZoom = undefined;
			}
			else {
				doc.map.zoomTo(doc.zoom);
			}
			if( typeof doc.initialCenter != 'undefined' ){
				doc.map.setCenter( new OpenLayers.LonLat(doc.initialCenter.x,doc.initialCenter.y) );
				doc.center = doc.initialCenter;
				doc.initialCenter = undefined;
			}
			else if( typeof doc.center != 'undefined' ){
				doc.map.setCenter( new OpenLayers.LonLat(doc.center.x,doc.center.y) );
			}
			else {
				doc.map.setCenter( new OpenLayers.LonLat(Math.round(ws/2),Math.round(hs/2)) );
				doc.center = { x: Math.round(ws/2), y: Math.round(hs/2) };
			}
			parent.stopProcessing();
		}
		graphic.src = url;
	};

	/*
	* displays <page> by triggering parent dialogs paginator
	*/
	this.display = function(page){
		page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
	};

	/*
	* resizes view
	*/
	this.resize = function(){
		$(contentPanel).css('height',$(container).height()+'px');
		if( typeof this.actualPage != 'undefined' ){
			this.showPage(this.actualPage);
		}
	};

	/*
	* updates view if dialog is linked and a pagechange was performed in another linked view with the same document
	*/
	this.onChange = function(change){
		if( change.type == "pageChange" ){
			if( this.actualPage != change.data ){
				parent.page = change.data;
				parent.paginator.setPage(change.data,true);
				this.showPage(change.data);
			}
		}
	};
	
}
