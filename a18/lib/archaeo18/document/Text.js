/*
* view to show complete fulltext
*/
Text = function(doc,container,parent){
	
	this.type = "text";
	this.container = container;
	this.colorizeEntities = a18Props.colorizeOnStart;
	this.lineNumbers = a18Props.numbersOnStart;
	this.stopped = true;
	this.pages = doc.pages;

	var buttonPanel = $('<div/>').appendTo(container);
	buttonPanel.addClass('buttonPanel');

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	var context = this;
	// allow dialog pagination
	var trigger = function(page){
		var node = $(context.pageHooks[page-1]);
		$(contentPanel).scrollTop($(node).offset().top-$(contentPanel).offset().top+$(contentPanel).scrollTop());
		parent.pageChanged(page);
	}
	parent.paginator.setTriggerFunc(trigger);
	parent.showPagination();

	// allow dialog facet selection ?
	if( a18Props.colorizeEntities ){
		var triggerFacets = function(facetSelection){
			a18Gui.colorizeLinks($(contentPanel),facetSelection);
			parent.facetsChanged(facetSelection);
		}
		parent.facetSelector.setTriggerFunc(triggerFacets);
		parent.showFacets();
	}

	/*
	* display fulltext, colorizes links
	*/
	this.display = function(page,id){
		$(contentPanel).empty();
		var show = function(text){
		    	$(text).appendTo(contentPanel);
			a18Gui.appendTooltips($(contentPanel),parent);
			a18Gui.colorizeLinks($(contentPanel),parent.facetSelection);
//			context.pageHooks = $('span[class^="page"]',contentPanel);
			context.pageHooks = $("hr[class='tei:pb']",contentPanel);
			var avoidScroll = false;
			$(contentPanel).scroll(function(){
				if( avoidScroll ){
					avoidScroll = false;
					return;
				}
				var scrollTop = $(contentPanel).scrollTop();
				var height = $(contentPanel).height();
				for( var i=0; i<context.pageHooks.length; i++ ){
					var top = $(context.pageHooks[i]).position().top+scrollTop;
					if( scrollTop <= top && top < scrollTop+height ){
						parent.paginator.setPage(i+1,true);
						parent.pageChanged(i+1);
						break;
					}
				}
			});
			if( parent.lineNumbers ){
				new LineNumberOracle(contentPanel,a18Props.lineNumbering);
			}
			if( typeof id != 'undefined' ){
				var node = $(contentPanel).find("a[name='"+id+"']")[0];
				$(contentPanel).scrollTop($(node).offset().top-$(contentPanel).offset().top+$(contentPanel).scrollTop());
			}
			else if( parent.page > 0 ){
				avoidScroll = true;
//				var node = $(contentPanel).find("span[class='page"+parent.page+"']")[0];
				var node = $(context.pageHooks[parent.page-1]);
				$(contentPanel).scrollTop($(node).offset().top-$(contentPanel).offset().top+$(contentPanel).scrollTop());
				parent.paginator.setPage(parent.page,true);
			}
		}
		if( typeof doc.fullText != 'undefined' ){
			show(doc.fullText);
		}
		else {
			this.stopped = false;
			$.ajax({
				url: a18Props.textQuery.replace('DOC_ID',doc.title),
				dataType: "html",
				beforeSend: function() {
					parent.startProcessing();
				},
				error: function(errorObject){
					if( !context.stopped ){
						show(Util.getErrorMessage(errorObject.status));
						parent.stopProcessing();
					}
				},
				success: function(text){
					doc.fullText = text;
					if( !context.stopped ){
						show(doc.fullText);
						parent.stopProcessing();
					}
				}
			});
		}
	};

	/*
	* resizes view
	*/
	this.resize = function(){
		$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
	};

	/*
	* updates view if dialog is linked and a pagechange was performed in another linked view with the same document
	*/
	this.onChange = function(change){
		if( change.type == "pageChange" ){
			parent.page = change.data;
			parent.paginator.setPage(change.data,true);
			var node = $(this.pageHooks[change.data-1]);
			$(contentPanel).scrollTop($(node).offset().top-$(contentPanel).offset().top+$(contentPanel).scrollTop());
		}
		else if( change.type == "positionChange" ){
			var node = $(contentPanel).find("a[name='"+change.data+"']")[0];
			$(contentPanel).scrollTop($(node).offset().top-$(contentPanel).offset().top+$(contentPanel).scrollTop());
		}
		else if( change.type == "facetsChange" ){
			parent.facetSelector.setFacetSelection(change.data);
			a18Gui.colorizeLinks($(contentPanel),change.data);
		}
	};

}
