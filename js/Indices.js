/*
* indices page implementation
*/
var Indices = new function(){

	this.initialized = false;

	var section;

	/*
	* initialize indices page; load facets
	*/
	this.initialize = function(){
		
		this.initialized = true;

		var gui = this;

		GeoTemConfig.applySettings({
			language: EditionGui.language,
			allowFilter: false,
			highlightEvents : false,
			selectionEvents : false
		});

		this.selectionContainer = $("#indicesSelection");
		$('<h2>'+Util.getString('indexSelection')+'</h2>').appendTo(this.selectionContainer);
		$('<p>'+Util.getString('pleaseSelectIndex')+'</p>').appendTo(this.selectionContainer);

		var form = $('<form/>').appendTo(this.selectionContainer);
		var fieldset = $('<fieldset/>').appendTo(form);
		this.selectionDropdown = $('<select class="selectIndices"/>').appendTo(fieldset);
		$(this.selectionDropdown).change(function(){
			$("select option:selected",this.selectionDropdown).each(function(){
				if( $(this).attr('id').indexOf('tei') != -1 ){
					gui.showFacetSection($(this).attr('id'));
				}
			});
		});

		$('<option>'+Util.getString('selectIndex')+'</option>').appendTo(this.selectionDropdown);

		this.sectionContainer = $("#sectionContainer");

		if( !Util.facetsLoaded ){
			Util.loadFacets();
		}
		for( var i=0; i<Util.facets.length; i++ ){
			var facet = Util.facets[i];
			if( facet.render ){
				$('<option id="'+facet.facet+'">'+Util.getFacetLabel(facet)+'</option>').appendTo(gui.selectionDropdown);
			}
		}

	};

	/*
	* show table and tags/map for facet with <facetId>
	*/
	this.showFacetSection = function(facetId){
		if( facetId == Util.getString('selectIndex') ){
			return;
		}
		var status;
		var appendStatus = function(msg,server){
			status = $('<p>'+msg+'</p>').appendTo(section);
			$(status).css('margin-top','20px');
			var img = $('<img src="img/ajax-loader2.gif"/>').appendTo(status);
			$(img).css('padding','0px');
			$(img).css('box-shadow','none');
			$(img).css('margin-left','10px');
			if( server ){
				$("<p style='color:red;'>"+Util.getString('busyServer')+"</p>").appendTo(status);
			}
		};
		$(this.sectionContainer).empty();
		var facet = Util.getFacet(facetId);
		section = $("<section/>").appendTo(this.sectionContainer);
		$('<h2>'+Util.getFacetLabel(facet)+'</h2>').appendTo(section);
		var tableLoaded = false, cloudLoaded = false;
		appendStatus(Util.getString('loadTable'));
		setTimeout(function(){
			if( !tableLoaded ){
				$(status).remove();
				appendStatus(Util.getString('loadTable'),true);
			}
		}, IndicesProps.serverTimeout );
		$.ajax({
			url: EditionProperties.facetTableQuery.replace('FACET_ID',facet.facet),
			dataType: 'html',
			success: function(xhtml){
				$(status).remove();
				tableLoaded = true;
				$(this.sectionContainer).empty();
				var dummy = $('<div/>');
				$(xhtml).appendTo(dummy);
				var table = $($('table',dummy)[0]).appendTo(section);
				$(table).attr('width','100%');
				$(table).attr('id','tableIncices');
				$('span',section).each(function(){
					var lang = Util.getAttribute(this,'xml:lang');
					if( Util.language != lang ){
						$(this).css('display','none');
					}
				});
				$('.editionRef',section).each(function(){
					var params = Util.getAttribute(this,'rel');
					params = params.split(';');
					var linkString = 'http://'+location.host+'/archaeo18/edition.php?docParams='+params;
					$(this).click(function(e){
						showDiv('#edition_page','#linkedition',e);
						if( !EditionGui.initialized ){
							EditionGui.initialize();
						}
						EditionGui.gridLayout();
						var getDoc = function(){
							if( Util.docsLoaded != 1 ){
								setTimeout( function(){ getDoc(); }, 100 );
							}
							else {
								var doc = Util.getDoc(params[0]);
								var page = parseInt(params[1]);
								EditionGui.openDocument(false,doc,page,"pages",undefined,facet.facet);
							}
						}
						getDoc();
					});
				});
				$(table).dataTable({
					"oLanguage": {
						"sLengthMenu": "Zeige _MENU_ Eintr&auml;ge je Seite",
						"sZeroRecords": "Keine Eintr&auml;ge gefunden",
						"sInfo": "Zeige _START_ bis _END_ von _TOTAL_ Eintr&auml;gen",
						"sInfoEmpty": "Zeige 0 bis 0 von 0 Eintr&auml;gen",
						"sInfoFiltered": "(gefiltert aus _MAX_ Eintr&auml;gen insgesamt)",
						"sSearch": "Suche:",
						"oPaginate": {
							"sNext": "N&auml;chste Seite",
							"sPrevious": "Vorherige Seite"
						}
					}
				});
				if( facet.facet.indexOf('placeName') == -1 ){
					appendStatus(Util.getString('loadTagcloud'));
					setTimeout(function(){
						if( !cloudLoaded ){
							$(status).remove();
							appendStatus(Util.getString('loadTagcloud'),true);
						}
					}, IndicesProps.serverTimeout );
					$.ajax({
						url: EditionProperties.tagcloudQuery.replace('FACET_ID',facet.facet),
						dataType: 'xml',
						success: function(xml){
							cloudLoaded = true;
							if( $("#indices_page").css('display') == 'none' ){
								Indices.data = {
									type: 'cloud',
									data: xml
								};
							}
							else {
								Indices.displayCloud(xml);
							}
							$(status).remove();
						}
					});
				}
				else {
					appendStatus(Util.getString('loadMap'));
					setTimeout(function(){
						if( !cloudLoaded ){
							$(status).remove();
							appendStatus(Util.getString('loadMap'),true);
						}
					}, IndicesProps.serverTimeout );
					$.ajax({
						url: EditionProperties.mapQuery.replace('FACET_ID',facet.facet),
						dataType: 'xml',
						success: function(kml){
							cloudLoaded = true;
							if( $("#indices_page").css('display') == 'none' ){
								Indices.data = {
									type: 'map',
									data: kml
								};
							}
							else {
								Indices.displayMap(kml);
							}
							$(status).remove();
						}
					});
				}
			}
		});
	};

	this.displayCloud = function(xml){
		var inputField = $('#tableIncices_filter :input')[0];
		var tagArray = Util.getTags($(xml).find('tag'));
		var tagsDiv = $("<div/>").appendTo(section);
		$(tagsDiv).css('height','200px');
		$(tagsDiv).css('margin-top','50px');
		$(tagsDiv).css('margin-bottom','50px');
		$(tagsDiv).jQCloud(tagArray);
		var clicked = false;
		$(tagsDiv).mouseenter(function(){
			if( !clicked ){
				clicked = true;
				$('.tagcloudTag',tagsDiv).each(function(){
					$(this).removeAttr("href");
					$(this).css('cursor','pointer');
					$(this).click(function(evt){
						$(inputField).val($(this).html());
						$(inputField).trigger('keyup');
					});
				});
			}
		});
	};

	this.displayMap = function(kml){
		var mapDiv = $("<div/>").appendTo(section);
		$(mapDiv).css('position','relative');
		$(mapDiv).css('height','400px');
		$(mapDiv).css('margin-top','50px');
		$(mapDiv).css('margin-bottom','50px');
		var loadMap = function(){
			if( typeof GeoTemConfig == 'undefined' ){
				setTimeout( function(){ loadMap(); }, 1000 );
			}
			var map = new WidgetWrapper();
			var mapWidget = new MapWidget(map,$(mapDiv)[0],{
				mapWidth: false,
				mapHeight: false,
				mapSelection: false,
				mapSelectionTools: false,
				dataInformation: false,
				mapCanvasFrom: '#DDD',
				mapCanvasTo: '#DDD',
				maxPlaceLabels: 8
			});
			map.display([new Dataset(GeoTemConfig.loadKml(kml))]);
		}
		loadMap();
	};

	this.checkDisplay = function(){
		if( typeof this.data != 'undefined' ){
			if( this.data.type == 'cloud' ){
				this.displayCloud(this.data.data);
			}
			if( this.data.type == 'map' ){
				this.displayMap(this.data.data);
			}
			this.data = undefined;
		}
	};

};

IndicesProps = {
	serverTimeout: 10000	//in ms
};
