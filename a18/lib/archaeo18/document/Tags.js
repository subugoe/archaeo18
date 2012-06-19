Tags = function(doc,container,parent){
	
	this.type = "tags";
	this.container = container;
	this.stopped = true;

	var buttonPanel = $('<div/>').appendTo(container);
	buttonPanel.addClass('buttonPanel');

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	var context = this;
	var triggerFacets = function(facetSelection){
		context.display();
		parent.facetsChanged(facetSelection);
	}
	parent.facetSelector.setTriggerFunc(triggerFacets);
	parent.showFacets();

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
		var documentTags = $("<input type='radio' name='"+id+"'>"+Util.getString('documentTags')+"</input>").appendTo(buttonPanel);
		var tagsByPages = $("<input type='radio' name='"+id+"'>"+Util.getString('tagsByPages')+"</input>").appendTo(buttonPanel);
		if( this.documentScope ){
			$(documentTags).attr('checked',true);
		}
		else {
			$(tagsByPages).attr('checked',true);
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
				context.display();
				parent.scopeChanged(scope);
			}
		};
		$(documentTags).click(function(){
			setScope(true);
		});
		$(tagsByPages).click(function(){
			setScope(false);
		});
	}	

	var context = this;
	var toolbar = $("<div/>").appendTo(buttonPanel);
/*
	if( a18Props.colorizeEntities ){
		var colorizeLink = $("<a style='margin:5px;' href='javascript:void(0)'/>").appendTo(toolbar);
		var set1 = function(){
			if( context.colorizeEntities ){
				$(colorizeLink).html(Util.getString('decolorizeEntities'));
			}
			else {
				$(colorizeLink).html(Util.getString('colorizeEntities'));
			}
		}
		colorizeLink.click(function(){
			context.colorizeEntities = !context.colorizeEntities;
			set1();
			if( context.colorizeEntities ){
				a18Gui.colorizeLinks($(contentPanel),false);
			}
			else {
				a18Gui.colorizeLinks($(contentPanel),true);
			}
		});
		set1();
	}
*/

	this.show = function(page){
		var facets = parent.facetSelector.getFacetString();
		if( facets == '' ){
			$(a18Gui.getAlertMessage(Util.getString('selectFacetsAlert'))).appendTo(contentPanel);
			return;
		}
		this.stopped = false;
		$.ajax({
			url: a18Props.tagcloudDocQuery.replace('DOC_ID',doc.title).replace('FACET_ID',facets).replace('PAGE_ID',page),
			dataType: "xml",
			beforeSend: function() {
				parent.startProcessing();
			},
			error: function(errorObject){
				if( !context.stopped ){
					$(a18Gui.getErrorMessage(errorObject.status)).appendTo(contentPanel);
					parent.stopProcessing();
				}
			},
			success: function(xml){
				if( !context.stopped ){
					var tagArray = Util.getTags($(xml).find('tag'));
					context.tags = tagArray;
					var trigger = function(){
						a18Gui.appendTooltips(contentPanel);
						parent.stopProcessing();
					};
					$(contentPanel).jQCloud(tagArray,{trigger:trigger});
				}
			}
		});
	};

	this.showTags = function(){
		$(contentPanel).empty();
		this.show(0);
	};

	this.showPage = function(page){
		this.actualPage = page;
		$(contentPanel).empty();
		this.show(page);
	};

	this.display = function(page){
		if( this.documentScope ){
			this.showTags();
		}
		else {
			page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
		}
	};

	this.resize = function(){
		$(contentPanel).css('width','100%');
		$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
		if( typeof this.tags != 'undefined' ){
			$(contentPanel).empty();
			var trigger = function(){
				a18Gui.appendTooltips(contentPanel);
			};
			$(contentPanel).jQCloud(this.tags,{trigger:trigger});
			a18Gui.appendTooltips(contentPanel);
		}
	};

	this.onChange = function(change){
		if( change.type == "facetsChange" ){
			parent.facetSelector.setFacetSelection(change.data);
			context.display();
		}
	};

}
