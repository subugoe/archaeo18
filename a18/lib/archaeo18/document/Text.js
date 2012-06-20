Text = function(doc,container,parent){
	
	this.type = "text";
	this.container = container;
	this.colorizeEntities = a18Props.colorizeOnStart;
	this.lineNumbers = a18Props.numbersOnStart;
	this.stopped = true;

	var buttonPanel = $('<div/>').appendTo(container);
	buttonPanel.addClass('buttonPanel');

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');

	this.setFunctionality = function(colorize,numbering){
		this.colorizeEntities = colorize;
		this.lineNumbers = numbering;
	};

	if( a18Props.colorizeEntities ){
		var triggerFacets = function(facetSelection){
			a18Gui.colorizeLinks($(contentPanel),facetSelection);
			parent.facetsChanged(facetSelection);
		}
		parent.facetSelector.setTriggerFunc(triggerFacets);
		parent.showFacets();
	}

	this.display = function(id){
		var context = this;
		$(contentPanel).empty();
		var show = function(text){
		    	$(text).appendTo(contentPanel);
			a18Gui.appendTooltips($(contentPanel));
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
						show(a18Gui.getErrorMessage(errorObject.status));
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

	this.resize = function(){
		$(contentPanel).css('height',($(container).height()-$(buttonPanel).height())+'px');
	};

	this.onChange = function(change){
		if( change.type == "pageChange" ){
			var node = $(contentPanel).find("span[class='page"+change.data+"']")[0];
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
