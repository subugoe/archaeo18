/*
 * indices page implementation
 */
var Indices = (function() {
	"use strict";

	var index = {};

	var indexProperties = {
		serverTimeout: 10000,
		geoTemco: {
			language: EditionGui.language,
			allowFilter: false,
			highlightEvents: false,
			selectionEvents: false
		},
		dataTables: {
			"sPaginationType": "full_numbers",
			"oLanguage": {
				"sLengthMenu": "Zeige _MENU_ Einträge je Seite",
				"sZeroRecords": "Keine Einträge gefunden",
				"sInfo": "_START_ - _END_ von _TOTAL_ Einträgen",
				"sInfoEmpty": "Zeige 0 bis 0 von 0 Einträgen",
				"sInfoFiltered": "(gefiltert aus _MAX_ Einträgen insgesamt)",
				"sSearch": "Suche:",
				"oPaginate": {
					"sNext": "",
					"sFirst": "",
					"sLast": "",
					"sPrevious": ""
				}
			}
		}
	};

	index.initialized = false;

	var section;

	/*
	 * initialize indices page; load facets
	 */
	index.initialize = function() {

		index.initialized = true;

		var gui = this;

		GeoTemConfig.applySettings(indexProperties.geoTemco);

		index.selectionContainer = $("#indicesSelection");
		$('<h2>' + Util.getString('indexSelection') + '</h2>').appendTo(index.selectionContainer);
		$('<p>' + Util.getString('indexIntro') + '</p>').appendTo(index.selectionContainer);
		$('<p class="chooseIndex">' + Util.getString('pleaseSelectIndex') + '</p>').appendTo(index.selectionContainer);

		var form = $('<form/>').appendTo(index.selectionContainer);
		var fieldset = $('<fieldset/>').appendTo(form);
		index.selectionDropdown = $('<select class="selectIndices"/>').appendTo(fieldset);
		$(index.selectionDropdown).change(function() {
			$("select option:selected", this.selectionDropdown).each(function() {
				if ($(this).attr('id').indexOf('tei') !== -1) {
					gui.showFacetSection($(this).attr('id'));
				}
			});
		});

		$('<option>' + Util.getString('selectIndex') + '</option>').appendTo(index.selectionDropdown);

		index.sectionContainer = $("#sectionContainer");

		if (!Util.facetsLoaded) {
			Util.loadFacets();
		}
		for (var i = 0; i < Util.facets.length; i++) {
			var facet = Util.facets[i];
			if (facet.render) {
				$('<option id="' + facet.facet + '">' + Util.getFacetLabel(facet) + '</option>').appendTo(gui.selectionDropdown);
			}
		}

	};

	/*
	 * show table and tags/map for facet with <facetId>
	 */
	index.showFacetSection = function(facetId) {
		if (facetId === Util.getString('selectIndex')) {
			return;
		}
		var status;
		var appendStatus = function(msg, server) {
			status = $('<p>' + msg + '</p>').appendTo(section);
			$(status).css('margin-top', '20px');
			var img = $('<img src="Resources/Public/Images/ajax-loader2.gif"/>').appendTo(status);
			$(img).css('padding', '0px');
			$(img).css('box-shadow', 'none');
			$(img).css('margin-left', '10px');
			if (server) {
				$("<p class='alertMessage'>" + Util.getString('busyServer') + "</p>").appendTo(status);
			}
		};
		$(this.sectionContainer).empty();
		var facet = Util.getFacet(facetId);
		section = $("<section/>").appendTo(this.sectionContainer);
		$('<h2 class="facetLabel">' + Util.getFacetLabel(facet) + '</h2>').appendTo(section);
		var tableLoaded = false, cloudLoaded = false;
		appendStatus(Util.getString('loadTable'));
		setTimeout(function() {
			if (!tableLoaded) {
				$(status).remove();
				appendStatus(Util.getString('loadTable'), true);
			}
		}, indexProperties.serverTimeout);
		$.ajax({
				url: EditionProperties.facetTableQuery.replace('FACET_ID', facet.facet),
				dataType: 'html',
				success: function(xhtml) {
					$(status).remove();
					tableLoaded = true;
					$(this.sectionContainer).empty();
					var dummy = $('<div/>');
					$(xhtml).appendTo(dummy);
					var table = $($('table', dummy)[0]).appendTo(section);
					$(table).attr('width', '100%');
					$(table).attr('id', 'tableIndices');
					$('span', section).each(function() {
						var lang = Util.getAttribute(this, 'xml:lang');
						if (Util.language !== lang) {
							$(this).css('display', 'none');
						}
					});
					$('.editionRef', section).each(function() {
						var params = Util.getAttribute(this, 'rel');
						params = params.split(';');
						var linkString = location.protocol + '//' + location.host + '/archaeo18/edition.php?docParams=' + params;
						$(this).click(function(e) {
							ContentLoader.showDiv(
									'#edition_page',
									'#linkedition',
									e
							);
							if (!EditionGui.initialized) {
								EditionGui.initialize();
							}
							EditionGui.gridLayout();
							var getDoc = function() {
								if (Util.docsLoaded !== 1) {
									setTimeout(function() {
										getDoc();
									}, 100);
								}
								else {
									var doc = Util.getDoc(params[0]);
									var page = parseInt(params[1]);
									EditionGui.openDocument(
											false,
											doc, page,
											"pages",
											undefined,
											facet.facet
									);
								}
							};
							getDoc();
						});
					});
					$(table).dataTable(indexProperties.dataTables);

					if (facet.facet.indexOf('placeName') === -1) {
						appendStatus(Util.getString('loadTagcloud'));
						setTimeout(function() {
							if (!cloudLoaded) {
								$(status).remove();
								appendStatus(Util.getString('loadTagcloud'), true);
							}
						}, indexProperties.serverTimeout);
						$.ajax({
							url: EditionProperties.tagcloudQuery.replace('FACET_ID', facet.facet),
							dataType: 'xml',
							success: function(xml) {
								cloudLoaded = true;
								if ($("#indices_page").css('display') === 'none') {
									Indices.data = {
										type: 'cloud',
										data: xml
									};
								} else {
									Indices.displayCloud(xml);
								}
								$(status).remove();
							}
						});
					} else {
						appendStatus(Util.getString('loadMap'));
						setTimeout(function() {
							if (!cloudLoaded) {
								$(status).remove();
								appendStatus(Util.getString('loadMap'), true);
							}
						}, indexProperties.serverTimeout);
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
								} else {
									Indices.displayMap(kml);
								}
								$(status).remove();
							}
						});
					}
				}
			});
	};

	index.displayCloud = function(xml) {
		var inputField = $('#tableIndices_filter :input')[0];
		var tagArray = Util.getTags($(xml).find('tag'));
		var tagsDiv = $("<div/>").appendTo(section);
		$(tagsDiv).css('height', '200px');
		$(tagsDiv).css('margin-top', '50px');
		$(tagsDiv).css('margin-bottom', '50px');
		$(tagsDiv).jQCloud(tagArray);
		var clicked = false;
		$(tagsDiv).mouseenter(function() {
			if (!clicked) {
				clicked = true;
				$('.tagcloudTag', tagsDiv).each(function() {
					$(this).removeAttr("href");
					$(this).css('cursor', 'pointer');
					$(this).click(function(evt) {
						$(inputField).val($(this).html());
						$(inputField).trigger('keyup');
					});
				});
			}
		});
	};

	index.displayMap = function(kml) {
		var mapDiv = $("<div/>").appendTo(section);
		$(mapDiv).css('position', 'relative');
		$(mapDiv).css('height', '400px');
		$(mapDiv).css('margin-top', '50px');
		$(mapDiv).css('margin-bottom', '50px');
		var loadMap = function() {
			if (typeof GeoTemConfig === 'undefined') {
				setTimeout(function() {
					loadMap();
				}, 1000);
			}
			var map = new WidgetWrapper();
			var mapWidget = new MapWidget(map, $(mapDiv)[0], {
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
		};
		loadMap();
	};

	index.checkDisplay = function() {
		if (typeof this.data !== 'undefined') {
			if (this.data.type === 'cloud') {
				this.displayCloud(this.data.data);
			}
			if (this.data.type === 'map') {
				this.displayMap(this.data.data);
			}
			this.data = undefined;
		}
	};
	return index;
})();