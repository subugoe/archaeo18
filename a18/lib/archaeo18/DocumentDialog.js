DocumentDialog = function(parent,doc,div,page){
	
	this.document = doc;
	this.parent = parent;
	this.div = div;
	this.doctype;
	this.page = page || 0;
	this.fullscreen;
	this.doctypes = [];
		
	this.initialize = function(fs){
		this.container = $('<div/>');
		if( this.div != null ){
			$(this.container).appendTo(this.div);
		}
		this.container.css('position', 'relative' );
		this.fullscreen = new FullscreenWindow(this.container);
		this.funcDiv = $('<div class="toolstop clearfix"/>').appendTo(this.container);
		this.facetDiv = $('<div class="toolstop clearfix"/>').appendTo(this.container);
		this.docContainerDiv = $('<div class="windowcontent"/>').appendTo(this.container);
		this.docContainerDiv.css('overflow','auto');
		this.docTypeDiv = $('<div class="clearfix"/>').appendTo(this.container);
		this.initFunctions(fs);
		this.initDocTypeSelector();
		this.resize();
	};

	this.initFunctions = function(fs){
		var dialog = this;

		var paginationTools = $("<ul/>").appendTo(this.funcDiv);
		this.paginator = new Pagination(paginationTools,doc.pages,Util.getString);
		this.showPagination = function(){
			$(paginationTools).css('display','block');
		};
		this.hidePagination = function(){
			$(paginationTools).css('display','none');
		};

		var toolsList = $("<ul/>").appendTo(this.funcDiv);
		if( a18Props.lineNumbering ){
			var numberingLi = $('<li/>').appendTo(toolsList);
			this.lineNumbering = $('<a class="tools-linecount"/>').appendTo(numberingLi);
			var setLineNumbering = function(){
				if( dialog.lineNumbers ){
					//dialog.lineNumbering.attr('class','documentButton lineNumbersActivated');
					dialog.lineNumbering.attr('title',Util.getString('hideLineNumbers'));
				}
				else {
					//dialog.lineNumbering.attr('class','documentButton lineNumbersDeactivated');
					dialog.lineNumbering.attr('title',Util.getString('showLineNumbers'));
				}
			}
			this.lineNumbers = a18Props.numbersOnStart;
			setLineNumbering();
			this.lineNumbering.click(function(){
				dialog.lineNumbers = !dialog.lineNumbers;
				setLineNumbering();
				dialog.doctype.display();
			});
		}
		if( a18Props.pdfSource ){
			var pdfLi = $('<li/>').appendTo(toolsList);
			var pdf = $('<a class="tools-pdf"/>').appendTo(pdfLi);
			pdf.attr('title',Util.getString('pdf'));
			pdf.click(function(){
			});
		}
		if( a18Props.dfgViewer ){
			var dfgLi = $('<li/>').appendTo(toolsList);
			var dfgViewer = $('<a class="tools-dfg"/>').appendTo(dfgLi);
			dfgViewer.attr('title',Util.getString('dfgViewer'));
			dfgViewer.click(function(){
				var metsLink = 'http://'+location.host+''+a18Props.metsUri.replace('DOC_ID',doc.title);
				var link = a18Props.dfgViewer + '' + a18Gui.asciiToHex(metsLink);
				window.open(link, '_blank');
			});
		}
		if( !fs ){
			if( a18Props.connectable ){
				this.linked = false;
				var linkLi = $('<li/>').appendTo(toolsList);
				var link = $('<a class="tools-link"/>').appendTo(linkLi);
				link.attr('title',Util.getString('linkDeactivated'));
				link.click(function(){
					if( dialog.linked ){
						Publisher.Unsubscribe(doc.id,dialog);
//						link.attr('class','documentButton linkDeactivated');
						link.attr('title',Util.getString('linkDeactivated'));
					}
					else {
						Publisher.Subscribe(doc.id,dialog,function(data){
							dialog.doctype.onChange(data);
						});
//						link.attr('class','documentButton linkActivated');
						link.attr('title',Util.getString('linkActivated'));
					}
					dialog.linked = !dialog.linked;
				});
			}							
			var fullscreenLi = $('<li/>').appendTo(toolsList);
			var fullscreen = $('<a class="tools-maximize"/>').appendTo(fullscreenLi);
			fullscreen.attr('title',Util.getString('fullscreenMode'));
			fullscreen.click(function(){
				a18Gui.documentFullscreen(dialog,dialog.doctype.type);
			});
		}
		this.facetSelector = new FacetSelector(this.facetDiv);
		$(this.facetDiv).css('text-align','center');
		this.showFacets = function(){
			$(dialog.facetDiv).css('display','block');
		};
		this.hideFacets = function(){
			$(dialog.facetDiv).css('display','none');
		};
	};

	this.resize = function(){
		var width = this.container.parent().width();
		var height = this.container.parent().height();
		height -= parseInt($(this.container.parent()).css("margin-top"))+parseInt($(this.container.parent()).css("margin-bottom"));
		this.container.css('height', height+"px" );
		this.container.css('width', width+"px" );
		var paddingX = parseInt($(this.docContainerDiv).css("padding-left"))+parseInt($(this.docContainerDiv).css("padding-right"));
		var paddingY = parseInt($(this.docContainerDiv).css("padding-top"))+parseInt($(this.docContainerDiv).css("padding-bottom"));
		this.docContainerDiv.css('height', (height-paddingY-this.docContainerDiv.offset().top+this.container.offset().top - this.docTypeDiv.height())+"px" );
		this.docContainerDiv.css('width', (width-paddingX)+"px" );
		this.docContainerDiv.css('maxHeight', (height-paddingY-this.docContainerDiv.offset().top+this.container.offset().top)+"px" );
		this.docContainerDiv.css('maxWidth', (width-paddingX)+"px" );
		if( this.doctype && typeof this.doctype.resize != 'undefined' ){
			this.doctype.resize();
		}
	};
	
	this.startProcessing = function(){
		var dialog = this;
		var stop = function(){
			dialog.doctype.stopped = true;
			dialog.fullscreen.removeFullscreen();
		};
		this.fullscreen.loaderFullscreen(stop);
	};

	this.stopProcessing = function(){
		this.doctype.stopped = true;
		this.fullscreen.removeFullscreen();
	};

	this.showTextAtPosition = function(id){
		if( this.linked ){
			Publisher.Publish(doc.id, {
				type: 'positionChange',
				data: id
			}, this);
		}
		else {
			this.setDocType('text');
			this.showDocumentType(id);
		}
	};

	this.pageChanged = function(page){
		this.page = page;
		if( this.linked ){
			Publisher.Publish(doc.id, {
				type: 'pageChange',
				data: page
			}, this);
		}
	};

	this.facetsChanged = function(facets){
		this.facetSelection = facets;
		if( this.linked ){
			Publisher.Publish(doc.id, {
				type: 'facetsChange',
				data: facets
			}, this);
		}
	};

	this.initDocTypeSelector = function(){
		
		var dialog = this;
		var viewsList = $('<ul class="pagination"/>').appendTo(this.docTypeDiv);

		this.buttons = [];

		var outlineLi = $('<li/>').appendTo(viewsList);
		var outlineView = $('<a class="tools-list"/>').appendTo(outlineLi);
		outlineView.attr('title',Util.getString('outline'));
		outlineView.click(function(){
			dialog.setDocType('outline');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: outlineView,
			type: 'outline'
		});

		var textLi = $('<li/>').appendTo(viewsList);
		var textView = $('<a class="tools-txt"/>').appendTo(textLi);
		textView.attr('title',Util.getString('text'));
		textView.click(function(){
			dialog.setDocType('text');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: textView,
			type: 'text'
		});
			
		var pagesLi = $('<li/>').appendTo(viewsList);
		var pagesView = $('<a class="tools-onepage"/>').appendTo(pagesLi);
		pagesView.attr('title',Util.getString('pages'));
		pagesView.click(function(){
			dialog.setDocType('pages');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: pagesView,
			type: 'pages'
		});

		var thumbnailLi = $('<li/>').appendTo(viewsList);
		var thumbnailView = $('<a class="tools-img"/>').appendTo(thumbnailLi);
		thumbnailView.attr('title',Util.getString('thumbnails'));
		thumbnailView.click(function(){
			dialog.setDocType('thumbnails');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: thumbnailView,
			type: 'thumbnails'
		});
		
		var imagesLi = $('<li/>').appendTo(viewsList);
		var imagesView = $('<a class="tools-images"/>').appendTo(imagesLi);
		imagesView.attr('title',Util.getString('images'));
		imagesView.click(function(){
			dialog.setDocType('images');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: imagesView,
			type: 'images'
		});
		
		var teiLi = $('<li/>').appendTo(viewsList);
		var teiView = $('<a class="tools-tei"/>').appendTo(teiLi);
		teiView.attr('title',Util.getString('tei'));
		teiView.click(function(){
			dialog.setDocType('tei');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: teiView,
			type: 'tei'
		});

		var mapLi = $('<li/>').appendTo(viewsList);
		var mapView = $('<a class="tools-map"/>').appendTo(mapLi);
		mapView.attr('title',Util.getString('map'));
		mapView.click(function(){
			dialog.setDocType('map');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: mapView,
			type: 'map'
		});

		var tagsLi = $('<li/>').appendTo(viewsList);
		var tagsView = $('<a class="tools-tags"/>').appendTo(tagsLi);
		tagsView.attr('title',Util.getString('tags'));
		tagsView.click(function(){
			dialog.setDocType('tags');
			dialog.showDocumentType();
		});
		this.buttons.push({
			button: tagsView,
			type: 'tags'
		});
			
	};
	
	this.setDocType = function(type){
		if( typeof type == 'undefined' ){
			type = 'outline';
		}
		if( !this.doctype || this.doctype.type != type ){
			this.docContainerDiv.empty();
			if( type == 'pages' || type == 'text' ){
				this.lineNumbering.css('display','inline-block');
			}
			else {
				this.lineNumbering.css('display','none');
			}
			this.hidePagination();
			this.hideFacets();
			if( type == 'text' ){
				this.doctype = new Text(this.document,this.docContainerDiv,this);
			}
			else if( type == 'pages' ){
				this.doctype = new Pages(this.document,this.docContainerDiv,this);
			}
			else if( type == 'thumbnails' ){
				this.doctype = new Thumbnails(this.document,this.docContainerDiv);
			}
			else if( type == 'images' ){
				this.doctype = new Images(this.document,this.docContainerDiv,this);
			}
			else if( type == 'tei' ){
				this.doctype = new TEI(this.document,this.docContainerDiv,this);
			}
			else if( type == 'outline' ){
				this.doctype = new Outline(this.document,this.docContainerDiv,this);
			}
			else if( type == 'map' ){
				this.doctype = new A18Map(this.document,this.docContainerDiv,this);
			}
			else if( type == 'tags' ){
				this.doctype = new Tags(this.document,this.docContainerDiv,this);
			}
			/*
			var dialog = this;
			$.each(this.buttons,function(i,button){
				if( button.type == type ){
					$(button.button).attr('class','documentButton '+button.type+'Activated');
				}
				else {
					$(button.button).attr('class','documentButton '+button.type+'Deactivated');
				}
			});
			*/
			this.resize();
		}
	};

	this.setFunctionality = function(f){
		var type = this.getDocType();
		if( type == 'text' || type == 'pages' ){
			this.doctype.setFunctionality(f.colorize,f.numbering);
		}
		if( type == 'images' ){
			this.doctype.setOrientation(f.zoom,f.center);
		}
		this.showDocumentType();
	};

	this.getSetting = function(){
		var colorize, numbering, zoom, center;
		var type = this.getDocType();
		if( typeof type != 'undefined' ){
			if( type == 'text' || type == 'pages' ){
				colorize = this.doctype.colorizeEntities;
				numbering = this.doctype.lineNumbers;
			}
			if( type == 'images' ){
				zoom = this.doctype.zoom;
				center = this.doctype.center;
			}
		}
		return {
			t: this.document.title,
			v: type,
			p: this.page,
			c: colorize,
			n: numbering,
			z: zoom,
			x: center
		};
	};

	this.getDocType = function(){
		if( this.doctype ){
			return this.doctype.type;
		}
		return undefined;
	};
	
	this.showDocumentType = function(id){
	    	if( this.doctype.pages ){
			this.doctype.display(this.page);
	    	}
	    	else {
			this.doctype.display(id);
	    	}
	};
	
}
