/*
* view to show tags for document or pages
*/
Tags = function(doc,container,parent){
	
	this.type = "tags";
	this.container = container;
	this.stopped = true;
	this.pages = doc.pages;

	var buttonPanel = $('<div/>').appendTo(container);
	buttonPanel.addClass('buttonPanel');

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	var context = this;
	// allow dialog facet selection
	var triggerFacets = function(facetSelection){
		context.display();
		parent.facetsChanged(facetSelection);
	}
	parent.facetSelector.setTriggerFunc(triggerFacets);
	parent.showFacets();

	// allow dialog pagination
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
	* retrieve tags for page
	*/
	this.show = function(page){
		var facets = parent.facetSelector.getFacetString();
		if( facets == '' ){
			$(Util.getAlertMessage(Util.getString('selectFacetsAlert'))).appendTo(contentPanel);
			return;
		}
		if( !this.stopped ){
			parent.stopProcessing();
		}
		this.stopped = false;
		$.ajax({
			url: a18Props.tagcloudPageQuery.replace('DOC_ID',doc.title).replace('FACET_ID',facets).replace('PAGE_ID',page),
			dataType: "xml",
			beforeSend: function() {
				parent.startProcessing();
			},
			error: function(errorObject){
				if( !context.stopped ){
					$(Util.getErrorMessage(errorObject.status)).appendTo(contentPanel);
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

	/*
	* show document tags
	*/
	this.showTags = function(){
		$(contentPanel).empty();
		this.show(0);
	};

	/*
	* show page tags
	*/
	this.showPage = function(page){
		this.actualPage = page;
		$(contentPanel).empty();
		this.show(page);
	};

	/*
	* display page (page=0 --> display document tags)
	*/
	this.display = function(page){
		if( this.documentScope ){
			this.showTags();
		}
		else {
			page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
		}
	};

	/*
	* resizes view
	*/
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

	/*
	* updates view if dialog is linked and a pagechange was performed in another linked view with the same document
	*/
	this.onChange = function(change){
		if( change.type == "facetsChange" ){
			parent.facetSelector.setFacetSelection(change.data);
			context.display(parent.page);
		}
		if( change.type == "pageChange" ){
			if( this.actualPage != change.data ){
				parent.page = change.data;
				parent.paginator.setPage(change.data,true);
				this.showPage(change.data);
			}
		}
	};

}
