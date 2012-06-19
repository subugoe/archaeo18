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
	if( this.documentScope ){
		parent.hidePagination();
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
				parent.scopeChanged(scope);
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
	STIStatic.applySettings({
		mapWidth: false,
		mapHeight: false,
		mapSelection: false,
		binningSelection: false,
		mapSelectionTools: false,
		dataInformation: false,
		alternativeMap: false,
		osmMaps: true,
		mapCanvasFrom: '#DDD',
		mapCanvasTo: '#DDD',
		language: a18Gui.language,
		maxPlaceLabels: 8,
		incompleteData: true
	});
	var mapWrapper = new MapWrapper();
	mapWrapper.initialize(contentPanel[0],0);

	this.setOrientation = function(zoom,center){
		this.initialZoom = zoom;
		this.initialCenter = center;
	};
	
	this.show = function(page){
		if( !doc.kmlCache[page] ){
			this.stopped = false;
    			$.ajax({
				url: a18Props.kmlQuery.replace('DOC_ID',doc.title).replace('PAGE_ID',page),
				dataType: "xml",
				beforeSend: function() {
					parent.startProcessing();
				},
				success: function(kml){
					doc.kmlCache[page] = STIStatic.loadSpatioTemporalKMLData(null,kml);
					if( !context.stopped ){
						mapWrapper.display([doc.kmlCache[page]]);
						parent.stopProcessing();
					}
				}
			});
		}
		else {
			mapWrapper.display([doc.kmlCache[page]]);
		}
	};

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

	this.showPlaces = function(){
		if( contentPanel.width() == 0 ){
			return;
		}
		this.show(0);
	};

	this.display = function(page){
		if( this.documentScope ){
			this.showPlaces();
		}
		else {
			page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
		}
	};

	this.resize = function(){
		if( this.documentScope ){
			$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
		}
		else {
			$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
		}
		$(contentPanel).css('width','100%');
		mapWrapper.map.gui.resize();
	};

	this.onChange = function(change){
		if( change.type == "pageChange" ){
			if( this.actualPage != change.data ){
				parent.paginator.setPage(change.data,true);
				this.showPage(change.data);
			}
		}
	};
	
}
