Pages = function(doc,container,parent){
	
	this.type = "pages";
	this.doc = doc;
	this.pages = doc.pages;
	this.actualPage;
	this.lineNumbers = a18Props.numbersOnStart;

	var buttonPanel = $('<div/>').appendTo(container);
	buttonPanel.addClass('buttonPanel');

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	var context = this;
	var trigger = function(page){
		context.showPage(page);
		parent.pageChanged(page);
	}
	parent.paginator.setTriggerFunc(trigger);
	parent.showPagination();

	this.setFunctionality = function(colorize,numbering){
		this.lineNumbers = numbering;
	};
	
	var context = this;

	if( a18Props.colorizeEntities ){
		var triggerFacets = function(facetSelection){
			a18Gui.colorizeLinks($(contentPanel),facetSelection);
			parent.facetsChanged(facetSelection);
		}
		parent.facetSelector.setTriggerFunc(triggerFacets);
		parent.showFacets();
	}

	this.showPage = function(page){
		this.actualPage = page;
		var context = this;
		var checkBlank = function(){
			if( contentPanel.children().size() == 1 ){
				var div = contentPanel.children()[0];
				if( div && $(div).children().size() == 1 ){
					var innerDiv = $(div).children()[0];
					if( innerDiv && $(innerDiv).children().size() == 0 ){
						$("<p style='text-align:center;font-style:italic;'>"+Util.getString('blankPage')+"</p>").insertBefore($(innerDiv));
					}
				}
			}
		}
		var show = function(text){
			$(contentPanel).empty();
		    	$(text).appendTo(contentPanel);
		    	checkBlank();
			a18Gui.appendTooltips($(contentPanel));
			a18Gui.colorizeLinks($(contentPanel),parent.facetSelection);
			if( parent.lineNumbers ){
				new LineNumberOracle(contentPanel,a18Props.lineNumbering);
			}
		}
		if( !doc.pageCache[page-1] ){
			this.stopped = false;
    			$.ajax({
				url: a18Props.pageQuery.replace('DOC_ID',doc.title).replace('PAGE_ID',page),
				dataType: "html",
				beforeSend: function() {
					parent.startProcessing();
				},
				error: function(errorObject){
					if( !context.stopped ){
						show(a18Gui.getErrorMessage(errorObject.status));
						parent.stopProcessing();
					}
				},
				success: function(text){
					if( !context.stopped ){
						show(text);
						parent.stopProcessing();
					}
					doc.pageCache[page-1] = text;
				}
			});
		}
		else {
			show(doc.pageCache[page-1]);
		}
	};
	
	this.display = function(page){
		if( typeof page == 'undefined' ){
			page = parent.actualPage;
		}
		page ? parent.paginator.setPage(page,false) : parent.paginator.setPage(1,false);
	};
	
	this.resize = function(){
		$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
	};

	this.onChange = function(change){
		if( change.type == "pageChange" ){
			if( this.actualPage != change.data ){
				parent.paginator.setPage(change.data,true);
				this.showPage(change.data);
			}
		}
		else if( change.type == "facetsChange" ){
			parent.facetSelector.setFacetSelection(change.data);
			a18Gui.colorizeLinks($(contentPanel),change.data);
		}
	};

}
