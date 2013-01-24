/*
* view to show distribution of place names on map for document or pages
*/
A18Map = function(doc,container,parent){

	this.type = "map";
	this.images = doc.images;
	this.pages = doc.pages;
	this.actualPage;

	if( a18Props.scopeSelection ){
		var buttonPanel = $('<div/>').appendTo(container);
		buttonPanel.addClass('buttonPanel');
	}

	var context = this;
	var trigger = function(page){
		context.showPage(page);
		parent.pageChanged(page);
	}
	parent.paginator.setTriggerFunc(trigger);

	this.documentScope = a18Props.documentScope;
	if( !this.documentScope ){
		parent.showPagination();
	}
	if( a18Props.scopeSelection ){
		var id = 'scope'+a18Gui.getIndependentId();
		var documentPlaces = $("<input type='radio' name='"+id+"'>"+Util.getString('documentPlaces')+"</input>").appendTo(buttonPanel);
		var placesByPages = $("<input type='radio' name='"+id+"'>"+Util.getString('placesByPages')+"</input>").appendTo(buttonPanel);
		if( this.documentScope ){
			$(documentPlaces).attr('checked',true);
		}
		else {
			$(placesByPages).attr('checked',true);
		}
		var setScope = function(scope){
			if( context.documentScope != scope ){
				if( scope ){
					parent.hidePagination();
				}
				else {
					parent.showPagination();
				}
				context.documentScope = scope;				
				context.display(parent.page);
				context.resize();
			}
		};
		$(documentPlaces).click(function(){
			setScope(true);
		});
		$(placesByPages).click(function(){
			setScope(false);
		});
	}	

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('z-index',1);
	$(contentPanel).css('overflow','hidden');
	$(contentPanel).css('position','relative');
	$(contentPanel).css('height',$(container).height()+'px');
	$(contentPanel).css('width','100%');

	var map = new WidgetWrapper();
	var mapWidget = new MapWidget(map,$(contentPanel)[0],{
		mapWidth: false,
		mapHeight: false,
		mapSelection: false,
		mapSelectionTools: false,
		dataInformation: false,
		mapCanvasFrom: '#DDD',
		mapCanvasTo: '#DDD',
		maxPlaceLabels: 8
	});

	this.setOrientation = function(zoom,center){
		this.initialZoom = zoom;
		this.initialCenter = center;
	};
	
	/*
	* retrieve and show places for page
	*/
	this.show = function(page){
		if( !doc.kmlCache[page] ){
			if( !this.stopped ){
				parent.stopProcessing();
			}
			this.stopped = false;
    			$.ajax({
				url: a18Props.kmlQuery.replace('DOC_ID',doc.title).replace('PAGE_ID',page),
				dataType: "xml",
				beforeSend: function() {
					parent.startProcessing();
				},
				success: function(kml){
					doc.kmlCache[page] = GeoTemConfig.loadKml(kml);
					if( !context.stopped ){
						map.display([new Dataset(doc.kmlCache[page])]);
						parent.stopProcessing();
					}
				}
			});
		}
		else {
			map.display([new Dataset(doc.kmlCache[page])]);
		}
	};

	/*
	* show places for page
	*/
	this.showPage = function(page){
		if( contentPanel.width() == 0 ){
			return;
		}
		if( this.actualPage != page ){
			this.zoom = 0;
			this.center = undefined;
			this.actualPage = page;
		}
		this.show(page);
	};

	/*
	* show places for document
	*/
	this.showPlaces = function(){
		if( contentPanel.width() == 0 ){
			return;
		}
		this.show(0);
	};

	/*
	* show places for document (page=0 --> display document places)
	*/
	this.display = function(page){
		if( this.documentScope ){
			this.showPlaces();
		}
		else {
			page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
		}
	};

	/*
	* resizes view
	*/
	this.resize = function(){
		if( this.documentScope ){
			$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
		}
		else {
			$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
		}
		$(contentPanel).css('width','100%');
		map.widget.gui.resize();
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
