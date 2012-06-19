var Indices = new function(){

	this.initialize = function(){
		
		var gui = this;

		Util.loadTexts();

		this.selectionContainer = $("#selectionContainer");
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

		var trigger = function(facet){
			$('<option id="'+facet.facet+'">'+Util.getFacetLabel(facet)+'</option>').appendTo(gui.selectionDropdown);
		}
		Util.loadFacets(trigger);		

	};

	this.showFacetSection = function(facetId){
		if( facetId == Util.getString('selectIndex') ){
			return;
		}
		var status;
		var appendStatus = function(msg){
			status = $('<p>'+msg+'</p>').appendTo(section);
			$(status).css('margin-top','20px');
			var img = $('<img src="a18/images/ajax-loader2.gif"/>').appendTo(status);
			$(img).css('padding','0px');
			$(img).css('box-shadow','none');
			$(img).css('margin-left','10px');
		};
		$(this.sectionContainer).empty();
		var facet = Util.getFacet(facetId);
		var section = $("<section/>").appendTo(this.sectionContainer);
		$('<h2>'+Util.getFacetLabel(facet)+'</h2>').appendTo(section);
		appendStatus(Util.getString('loadTable'));
		$.ajax({
			url: a18Props.facetTableQuery.replace('FACET_ID',facet.facet),
			dataType: 'html',
			success: function(xhtml){
				$(this.sectionContainer).empty();
				var dummy = $('<div/>');
				$(xhtml).appendTo(dummy);
				var table = $($('table',dummy)[0]).appendTo(section);
				$(table).attr('width','100%');
				$(table).attr('id','tableIncices');
				$(table).dataTable();
				$('span',section).each(function(){
					var lang = Util.getAttribute(this,'xml:lang');
					if( Util.language != lang ){
						$(this).css('display','none');
					}
				});
				$(status).remove();
				if( facet.facet.indexOf('placeName') == -1 ){
					appendStatus(Util.getString('loadTagcloud'));
					$.ajax({
						url: a18Props.tagcloudQuery.replace('FACET_ID',facet.facet),
						dataType: 'xml',
						success: function(xml){
							var tagArray = Util.getTags($(xml).find('tag'));
							var tagsDiv = $("<div/>").appendTo(section);
							$(tagsDiv).css('height','200px');
							$(tagsDiv).css('margin-top','50px');
							$(tagsDiv).css('margin-bottom','50px');
							$(tagsDiv).jQCloud(tagArray);
							$(status).remove();
						}
					});
				}
				else {
					appendStatus(Util.getString('loadMap'));
					$.ajax({
						url: a18Props.mapQuery.replace('FACET_ID',facet.facet),
						dataType: 'xml',
						success: function(kml){
							var mapDiv = $("<div/>").appendTo(section);
							$(mapDiv).css('position','relative');
							$(mapDiv).css('height','400px');
							$(mapDiv).css('margin-top','50px');
							$(mapDiv).css('margin-bottom','50px');
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
								language: Util.language,
								maxPlaceLabels: 8,
								incompleteData: true
							});
							var mapWrapper = new MapWrapper();
							mapWrapper.initialize(mapDiv[0],0);
							mapWrapper.display([STIStatic.loadSpatioTemporalKMLData(null,kml)]);
							$(status).remove();
						}
					});
				}
			}
		});
	};

};

Indices.initialize();
