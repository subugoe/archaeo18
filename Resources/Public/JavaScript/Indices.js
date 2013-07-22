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

		// Templating
		var source = $("#indicesSelectionTemplate").html();
		var template = Handlebars.compile(source);
		var data = [];

		data['indexSelectionHeader'] = Util.getString('indexSelection');
		data['pleaseSelectIndex'] = Util.getString('pleaseSelectIndex');
		data['selectIndex'] = Util.getString('selectIndex');

		data['options'] = [];

		if (!Util.facetsLoaded) {
			Util.loadFacets();
		}
		for (var i=0; i < Util.facets.length; i++) {
			var facet = Util.facets[i];
			if (facet.render) {
				data['options'][i] = [];
				data['options'][i]['id'] = facet.facet;
				data['options'][i]['title'] = Util.getFacetLabel(facet);
			}
		}
		// put data into template
		$("#indicesSelection").html(
			template(data)
		);

		// add function for listening to changes
		$('.selectIndices').change(function(){
			$("option:selected", this).each(function(){
				if ($(this).attr('id').indexOf('tei') != -1) {
					gui.showFacetSection($(this).attr('id'));
				}
			});
		});
	};

	/*
	* show table and tags/map for facet with <facetId>
	*/
	this.showFacetSection = function(facetId) {

		if (facetId == Util.getString('selectIndex')) {
			return;
		}

		var status = $("#sectionContainerMessage");
		var appendStatus = function(msg, server) {

			// Templating
			var source = $("#sectionContainerMessageTemplate").html();
			var template = Handlebars.compile(source);
			var data = [];

			data['message'] = msg;
			if (server) {
				data['alertMessage'] = Util.getString('busyServer');
			}
			// put data into template
			$("#sectionContainerMessage").html(
				template(data)
			);
		};

		// another templating section
		var sectionContainerTemplateSource = $("#sectionContainerTemplate").html();
		var template = Handlebars.compile(sectionContainerTemplateSource);
		var data = [];

		// $("#sectionContainerMessage").hide();
		var facet = Util.getFacet(facetId);

		data['facetLabel'] = Util.getFacetLabel(facet);


		var tableLoaded = false, cloudLoaded = false;
		appendStatus(Util.getString('loadTable'));
		setTimeout(function() {
			if (!tableLoaded) {
				$(status).empty();
				appendStatus(Util.getString('loadTable'), true);
			}
		}, IndicesProps.serverTimeout);


		$.ajax({
			url: EditionProperties.facetTableQuery.replace('FACET_ID', facet.facet),
			dataType: 'html',
			success: function(xhtml) {
				$(status).remove();

				tableLoaded = true;

				$('.indicesSection').empty();

				data['content'] = xhtml;

				$('.indicesSection .editionRef').each(function(){
					var params = Util.getAttribute(this, 'rel');
					params = params.split(';');
					var linkString = location.protocol + '//' + location.host + '/archaeo18/edition.php?docParams=' + params;
					$(this).click(function(e){
						showDiv(
								'#edition_page',
								'#linkedition',
								e
						);
						if (!EditionGui.initialized) {
							EditionGui.initialize();
						}
						EditionGui.gridLayout();
						var getDoc = function() {
							if (Util.docsLoaded != 1) {
								setTimeout(function() {
									getDoc();
								}, 100);
							}
							else {
								var doc = Util.getDoc(params[0]);
								var page = parseInt(params[1]);
								EditionGui.openDocument(
										false,
										doc,
										page,
										"pages",
										undefined,
										facet.facet
								);
							}
						}
						getDoc();
					});
				});

				if (facet.facet.indexOf('placeName') == -1) {
					appendStatus(Util.getString('loadTagcloud'));
					setTimeout(function(){
						if (!cloudLoaded) {
							$(status).remove();
							appendStatus(Util.getString('loadTagcloud'), true);
						}
					}, IndicesProps.serverTimeout);
					$.ajax({
						url: EditionProperties.tagcloudQuery.replace('FACET_ID', facet.facet),
						dataType: 'xml',
						success: function(xml) {
							cloudLoaded = true;
							if ($("#indices_page").css('display') == 'none') {
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
					setTimeout(function() {
						if (!cloudLoaded) {
							$(status).remove();
							appendStatus(Util.getString('loadMap'),true);
						}
					}, IndicesProps.serverTimeout);
					$.ajax({
						url: EditionProperties.mapQuery.replace('FACET_ID', facet.facet),
						dataType: 'xml',
						success: function(kml) {
							cloudLoaded = true;
							if ($("#indices_page").css('display') == 'none') {
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
				// put data into template
				$("#indicesSectionContainer").html(
					template(data)
				);

				// some post processing
				$('#indicesSectionContainer table')
					.first()
					.attr('id', 'tableIndices');

				$('.indicesSection span').each(function() {
					var lang = Util.getAttribute(this, 'xml:lang');
					if (Util.language !== lang) {
						$(this).css('display', 'none');
					}
				});

				$('#tableIndices').dataTable({
					"sPaginationType": "full_numbers",
					"oLanguage": {
						"sLengthMenu": "Zeige _MENU_ Eintr&auml;ge je Seite",
						"sZeroRecords": "Keine Eintr&auml;ge gefunden",
						"sInfo": "_START_ - _END_ von _TOTAL_ Eintr&auml;gen",
						"sInfoEmpty": "Zeige 0 bis 0 von 0 Eintr&auml;gen",
						"sInfoFiltered": "(gefiltert aus _MAX_ Eintr&auml;gen insgesamt)",
						"sSearch": "Suche:",
						"oPaginate": {
							"sNext": "",
							"sFirst": "",
							"sLast": "",
							"sPrevious": ""
						}
					}
				});
			}

		});
	};

	this.displayCloud = function(xml) {

		// Templating
		var source = $("#tagCloudTemplate").html();
		var template = Handlebars.compile(source);
		var data = [];

		var inputField = $('#tableIndices_filter :input')[0];
		var tagArray = Util.getTags($(xml).find('tag'));

		$('#tagCloud').jQCloud(tagArray);
		var clicked = false;
		$('#tagCloud').mouseenter(function(){
			if( !clicked ){
				clicked = true;
				$('.tagcloudTag', tagsDiv).each(function(){
					$(this).removeAttr("href");
					$(this).css('cursor', 'pointer');
					$(this).click(function(evt) {
						$(inputField).val($(this).html());
						$(inputField).trigger('keyup');
					});
				});
			}
		});
		// put data into template
		$("#tagCloud").html(
			template(data)
		);
	};

	this.displayMap = function(kml) {
		var loadMap = function(){
			if (typeof GeoTemConfig == 'undefined') {
				setTimeout(function() {
					loadMap();
				}, 1000 );
			}
			var map = new WidgetWrapper();
			var mapWidget = new MapWidget(map,$('#indicesMap')[0],{
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
		if (typeof this.data != 'undefined') {
			if (this.data.type == 'cloud' ) {
				this.displayCloud(this.data.data);
			}
			if (this.data.type == 'map') {
				this.displayMap(this.data.data);
			}
			this.data = undefined;
		}
	};

};

IndicesProps = {
	//in ms
	serverTimeout: 10000
};