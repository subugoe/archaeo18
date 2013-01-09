/**
* Arranges GUI of Archaeo18
*/
var a18Gui = new function(){
	
	this.contentWindows;
	this.windowIndex;
	this.independentId;
	this.zIndex = 0;
	this.magneticLinks = [];
	this.containerDiv = $('#editionContainer');
	this.containerDiv.css('height',(a18Props.windowHeight+2*a18Props.margin)+'px');

	/**
	* stops loading process of actual window tab
	*/
	$(document).keypress(function(e){
		if( e.keyCode == 27 ){
			e.preventDefault();
			a18Gui.activeWindow.stopProcessing();
		}
	});

	/**
	* initialize <number> content windows
	*/
	this.initializeWindows = function(number){
		for( var i=0; i<number; i++ ){
			this.addContentWindow();
		}
	};
	
	/**
	* returns the next z-index for the last clicked window
	*/
	this.getZIndex = function(){
		return ++this.zIndex;
	};

	/**
	* add a new content window
	*/
	this.addContentWindow = function(){
		var contentWindow = $('<div/>').appendTo(this.containerDiv);
		$.extend(contentWindow,new FrameWindow('window','clearfix'));
		contentWindow.initializeFrame({
			draggable: a18Props.draggable,
			resizable: a18Props.resizable,
			concealable: a18Props.concealable,
			removable: a18Props.removable,
			fullscreen: a18Props.fullscreen,
			triggerResize: function(){ contentWindow.resizeContent(); },
			triggerRemove: function(){ a18Gui.removeContentWindow(contentWindow); }
		});
		$.extend(contentWindow,new ContentWindow());
		contentWindow.initializeContentWindow(++this.windowIndex);
		this.contentWindows.push(contentWindow);
		contentWindow.setSize(this.windowWidth,a18Props.windowHeight);
		contentWindow.resize();
		contentWindow.css('top',(($(this.containerDiv).height()-contentWindow.height())/2)+'px');
		contentWindow.css('left',(($(this.containerDiv).width()-contentWindow.width())/2)+'px');
		contentWindow.setWindowFunctionality(!this.automaticGridLayout);
	};
	
	/**
	* initialize gui function
	*/
	this.initialize = function(){
		var gui = this;
		this.contentWindows = [];
		this.windowIndex = 0;
		this.independentId = 0;
		this.browserVisible = true;
		this.automaticGridLayout = false;

		GeoTemConfig.applySettings({
			language: a18Gui.language,
			allowFilter: false
		});

		Util.loadTexts();
		Util.loadFacets();
		
		this.browser = $('<div/>').appendTo(this.containerDiv);
		$.extend(this.browser,new FrameWindow('search','clearfix'));
		this.browser.initializeFrame({
			draggable: a18Props.draggable,
			resizable: a18Props.resizable,
			concealable: a18Props.concealable,
			removable: false,
			triggerResize: function(){ gui.browser.resizeContent(); }
		});
		$.extend(this.browser,new Browser());
		this.browser.initializeBrowser();
		this.browser.setSize(a18Props.windowWidth,a18Props.windowHeight);
		this.browser.resize();
		this.browser.resizeContent();
		this.browser.setWindowFunctionality(!this.automaticGridLayout);
		
		Util.loadDocuments(function(doc){
	    		gui.browser.addDocument(doc);
		},true);
		this.addControls();

		this.minHeight = $(this.containerDiv).height();

		if( window.location.href.indexOf('?params') != -1 ){
			this.setParams( window.location.href.slice(window.location.href.indexOf('?params=') + 8) );
		}
		else if( a18Props.guiConfig ){
			this.initializeWindows(a18Props.guiConfig.windows.length);
			this.initialLayout();
		}
		else {
			this.initializeWindows(a18Props.contentWindows);
			this.gridLayout();
		}
		
		this.tooltip = $('<div class="tooltip"/>').appendTo(this.containerDiv);
		
		this.browser.updateZIndex(true);

		if( window.location.href.indexOf('?docParams') != -1 ){
			var params = window.location.href.slice(window.location.href.indexOf('?docParams=') + 11).split(';');
			var doc = Util.loadDocumentSync(params[0]);
			var page = parseInt(params[1]);
			this.contentWindows[0].addTab(doc,page,'pages');
		}

	};

	/**
	* if initial gui is defined in A18Props, the values (position,size)) are attached here to the initializes windows
	*/
	this.initialLayout = function(){
		var conf = a18Props.guiConfig;
		this.browser.position(conf.browser.left,conf.browser.top);
		this.browser.setSize(conf.browser.width,conf.browser.height);
		this.browser.resize();
		var xmin = this.browser.offset().left;
		var xmax = this.browser.offset().left + this.browser.width();
		var ymin = this.browser.offset().top;
		var ymax = this.browser.offset().top + this.browser.height();
		var min = Math.min( a18Props.guiConfig.windows.length, this.contentWindows.length );
		for( var i=0; i<min; i++ ){
			var cw = this.contentWindows[i];
			cw.position(conf.windows[i].left,conf.windows[i].top);
			cw.setSize(conf.windows[i].width,conf.windows[i].height);
			cw.resize();
			cw.resizeContent();
			if( cw.offset().left < xmin ){
				xmin = cw.offset().left;
			}
			if( cw.offset().left + cw.width() > xmax ){
				xmax = cw.offset().left + cw.width();
			}
			if( cw.offset().top < ymin ){
				ymin = cw.offset().top;
			}
			if( cw.offset().top + cw.height() > ymax ){
				ymax = cw.offset().top + cw.height();
			}
		}
		var shiftX = Math.round(($(document).width()-xmax+xmin)/2);
		var shiftY = Math.round(($(document).height()-ymax+ymin)/2);
		this.browser.position(this.browser.offset().left+shiftX,this.browser.offset().top+shiftY);
		for( var i=0; i<min; i++ ){
			var cw = this.contentWindows[i];
			cw.position(cw.offset().left+shiftX,cw.offset().top+shiftY);
		}
	};
	
	/**
	* draw border links there are nested entities within the given <link>
	*/
	this.borderLink = function(link){
		for( var i=0; i<Util.facets.length; i++ ){
			var entity = Util.facets[i].facet.replace(':','\\:');
			if( $('.'+entity,link).length > 0 ){
				$(link).css('border-width','1px');
				return;
			}
		}
	};

	/**
	* returns an alternative name if available in the given <node>
	*/
	this.getAlternativeName = function(node){
		var nodes = node.childNodes;
		for( var i=0; i<nodes.length; i++ ){
			if( nodes[i].firstChild == null ){				
				if( i+1 < nodes.length ){
					if( nodes[i+1].firstChild == null ){
						continue;
					}
					if( nodes[i+1].getAttribute('class') == 'tei:addName' ){
						return nodes[i+1].innerHTML;
					}
				}
				return null;
			} 
		}
	};

	/**
	* checks height of the main container div; used to resize container if windows are dragged over boundaries
	*/
	this.checkHeight = function(){
		var highest;
		for( var i=0; i<this.contentWindows.length; i++ ){
			var cw = this.contentWindows[i];
			var yMax = $(cw).height() + $(cw).position().top;
			if( typeof highest == 'undefined' || yMax > highest ){
				highest = yMax;
			}
		}
		var yMaxBrowser = $(this.browser).height() + $(this.browser).position().top;
		if( typeof highest == 'undefined' || yMaxBrowser > highest ){
			highest = yMaxBrowser;
		}
		if( highest < this.minHeight - a18Props.margin ){
			highest = this.minHeight - a18Props.margin;
		}
		if( $(a18Gui.containerDiv).height() != highest + a18Props.margin ){
			$(a18Gui.containerDiv).css('height',(a18Props.margin+highest)+'px');
		}
	};


	/**
	* Appends mouseover-tooltips for all links/spans with facet-classes, all notes and all tei-references
	* @param {HTML Object} div the div that contains the links and spans 
	* @param {Dialog} dialog the dialog that contains the div
	*/
	this.appendTooltips = function(div,dialog){
		// links and spans
		for( var i=0; i<Util.facets.length; i++ ){
			var facet = Util.facets[i];
			if( !facet.render ){
				continue;
			}
			var entity = facet.facet.replace(':','\\:');
			var color = facet.color;
			$('.'+entity,div).addClass('entity');
			var links = $('.'+entity,div);
			$.each(links,function(index,link){
				$(link).css('text-decoration','none');
				var content = $('<div/>');
				var cert;
				var certainty = $('.type-certainty',link);
				if( typeof certainty[0] != 'undefined' ){
					cert = $(certainty[0]).html();
				}
				var altName = a18Gui.getAlternativeName(this);
				if( altName == null ){
					altName = link.innerHTML;
				}
				if( typeof cert != 'undefined' ){
					altName += " &#040;"+cert+"&#041;";
				}
				$(content).append('<p>'+altName+'</p>');
				var p = $('<p/>').appendTo(content);
				$(p).append('<div class="thumb" style="background-color:'+color+';"/>');
				$(p).append('<div class="tooltipLabel" style="color:'+color+';">'+Util.getFacetLabel(facet)+'</div>');
				var hyperlink1, hyperlink2;
				if( typeof link.href != 'undefined' ){
					hyperlink1 = $('<a href="javascript:void(0)">'+Util.getString('info')+'</a>');
					hyperlink2 = $('<a href="javascript:void(0)">'+Util.getString('database')+'</a>');
					$(p).append('<br>');
					$(p).append('<div class="anchor"/>');
					$(p).append('<div style="display:inline-block;padding-top:10px;">'+Util.getString('openLinkAs')+':</div>');
					var linkDiv = $(p).append('<div class="tooltipLabelLink"></div>');
					$(linkDiv).append($(hyperlink1));
					$(linkDiv).append('<br>');
					$(linkDiv).append($(hyperlink2));
				}
				var trigger = function(div){
					if( typeof hyperlink1 != 'undefined' ){
						$(hyperlink1).click(function(){
							tooltip.removeAllTooltips();
							new HyperlinkWindow(link.href,altName);
						});
						$(hyperlink2).click(function(){
							tooltip.removeAllTooltips();
							window.open(link.href,'_blank');
						});
					}
					a18Gui.appendTooltips(div,dialog);
					a18Gui.colorizeLinks(div);
				}
				tooltip.setTooltip(link,content,trigger);
				a18Gui.borderLink(link);
				if( a18Props.tooltipMode == 'click' ){
					link.href = 'javascript:void(0)';
				}
			});
		}
		// tei references
		try {
			var notes = $('.tei\\:ref',div);
			$.each(notes,function(index,note){
				var page = parseInt($(note).html());
				var content = $('<div/>');
				$(content).append('<p>'+Util.getString('reference')+' '+page+'</p>');
				var p = $('<p/>').appendTo(content);
				var a1 = $('<a href="javascript:void(0)">'+Util.getString('showPage')+'</a>').appendTo(p);
				$('<br/>').appendTo(p);
				var a2 = $('<a href="javascript:void(0)">'+Util.getString('showPageWindow')+'</a>').appendTo(p);
				var trigger = function(div){
					$(a1).click(function(){
						dialog.pageChanged(page);
						dialog.setDocType('pages');
						dialog.showDocumentType();
						tooltip.removeAllTooltips();
					});
					$(a2).click(function(evt){
						a18Gui.openDocument(evt,dialog.document,page,"pages");
						tooltip.removeAllTooltips();
					});
				}
				tooltip.setTooltip(note,content,trigger);
			});
		}
		catch(e){}
		// tei notes
		try {
			var notes = $('.tei\\:note',div);
			$.each(notes,function(index,note){
				var nameId = note.href.substring(note.href.indexOf('#')+1);
				var href = $('a[name='+nameId+']')[0];
				var content = $(href).parent()[0].innerHTML;
				tooltip.setTooltip(note,content,function(div){a18Gui.appendTooltips(div,dialog); a18Gui.colorizeLinks(div);});
			});	
		}
		catch(e){}
	};

	/**
	* colorizes links inside a given <div> for all facets, which are 'true' in <facetSelection>
	* facetSelection is an array of boolean values; each true means to color links for this entity
	*/
	this.colorizeLinks = function(div,facetSelection){
		var plain = true;
		if( typeof facetSelection != 'undefined' ){
			for( var i=0; i<Util.facets.length; i++ ){
				var facet = Util.facets[i];
				var entity = facet.facet.replace(':','\\:');
				var links = $('.'+entity,div);
				$.each(links,function(index,link){
					if( facetSelection[i] ){
						$(link).css('color',facet.color);
					}
					else {
						$(link).css('color','black');
					}
				});
				if( facetSelection[i] ){
					plain = false;
				}
			}
		}
		// if no facet is true, the plain (wikipedia) coloring is done
		if( plain ){
			for( var i=0; i<Util.facets.length; i++ ){
				var facet = Util.facets[i];
				if( !facet.render ){
					continue;
				}
				var entity = facet.facet.replace(':','\\:');
				var links = $('.'+entity,div);
				$.each(links,function(index,link){
					if( typeof link.href != 'undefined' ){
						$(link).css('color',a18Props.colors.validLink);
					}
					else {
						$(link).css('color',a18Props.colors.invalidLink);
					}
				});
			}
		}
	};
	
	/**
	* create a dialog (e.g. open document dialog) with a given <headline> and a given <content>
	*/
	this.createDialog = function(headline,content,evt){
		var gui = this;
		var id = "dialog"+this.getIndependentId();
		var dialog = $('<div id="'+id+'" class="dialog"/>').appendTo(this.containerDiv);
		var closeDialog = function(){			
			$(dialog).remove();
		}
		var zIndex = this.getZIndex();
		$(dialog).css('z-index',zIndex);
		$(dialog).mousedown(function(){
			if( gui.zIndex != zIndex ){
				zIndex = gui.getZIndex();
				$(dialog).css('z-index',zIndex);
			}
		});
		$('<div class="text">'+headline+'</div>').appendTo(dialog);
		var ul = $('<ul class="dialog-tools"/>').appendTo(dialog);
		var close = $('<li><a class="button-close"/><span class="visuallyhidden"></span></a></li>').appendTo(ul);
		$(close).css('display','inherit');
		$(close).click(closeDialog);
		$(content).appendTo(dialog);
		$('#'+id).draggable({handles: 'e'});
		var pos = this.getMousePosition(evt);
		$(dialog).css('top',(pos.top-$(this.containerDiv).offset().top+20)+'px');
		$(dialog).css('left',(pos.left+20)+'px');
		return dialog;
	}; 
	
	/**
	* if content window was removed, the names of the others are updated
	*/
	this.updateNames = function(){
		$.each(this.contentWindows,function(i,cw){
			cw.updateName(i+1);
		});
	};
	
	/**
	* returns an independent running index for setting div ids 
	*/
	this.getIndependentId = function(){
		return ++this.independentId;
	};
	
	/**
	* removes a content window (folder)
	*/
	this.removeContentWindow = function(cw){
		cw.remove();
		for( var i=0; i<this.contentWindows.length; i++ ){
			if( cw == this.contentWindows[i] ){
				this.contentWindows.splice(i,1);
				break;
			}
		}
		this.updateNames();
	};
	
	/**
	* positions and resizes browser and folder to match a grid layout like: || || || ||
	*/
	this.gridLayout = function(){
		
		var gui = this;

		var borderGap = parseInt($(this.browser).css('border-left-width')) + parseInt($(this.browser).css('border-right-width'));
		var marginGap = a18Props.margin;
		var windowGap = a18Props.windowGap;

		var w = $(this.containerDiv).width();
		var h = this.minHeight;
		
		var windowHeight, windowWidth;		
		if( a18Props.windowHeight ){
			windowHeight = a18Props.windowHeight;
		}
		else {
			windowHeight = h-2*marginGap;
		}
		var windowTop = Math.max( marginGap, Math.floor( (h-windowHeight)/2 ) );

		var visibleWindows = 0;
		$.each(this.contentWindows,function(i,cw){
			if( cw.visibility ){
				visibleWindows++;
			}
		});

		var availableWidth = w - 2*marginGap;
		availableWidth -= visibleWindows*(windowGap+borderGap);
		if( !this.browser.visibility ){
			availableWidth += windowGap;
		}
		else {
			availableWidth -= borderGap;
		}
		if( a18Props.browserWidth ){
			if( this.browser.visibility ){
				availableWidth -= a18Props.browserWidth;
			}
			windowWidth = Math.floor(availableWidth/visibleWindows);
			if( this.browser.visibility ){
				this.browser.setSize(a18Props.browserWidth,windowHeight);
			}
		}
		else {
			if( this.browser.visibility ){
				windowWidth = Math.floor(availableWidth/(visibleWindows+1));
				this.browser.setSize(windowWidth,windowHeight);
			}
			else {
				windowWidth = Math.floor(availableWidth/visibleWindows);
			}
		}
		
		var cwLeft = marginGap;
		if( this.browser.visibility ){
			this.browser.position(marginGap,windowTop);
			this.browser.resize();
			this.browser.resizeContent();
			cwLeft += $(this.browser).width() + windowGap;
		}

		var j = 0;
		$.each(this.contentWindows,function(i,cw){
			if( cw.visibility ){
				cw.position(cwLeft+j*(windowGap+windowWidth),windowTop);
				cw.setSize(windowWidth,windowHeight);
				cw.resize();
				cw.resizeContent();
				j++;
			}
		});

		if( typeof this.windowWidth == 'undefined' ){
			this.windowWidth = windowWidth;
		}

		this.checkHeight();	
	
	};
	
	/**
	* opens a document <doc> with an initial <page>, an initial view (<type>) and
	* an initial <position>-id in the text (only for fulltext view after trigger from outline view)
	*/
	this.openDocument = function(evt,doc,page,type,position){
		var gui = this;
		var candidates = [];
		$.each(this.contentWindows, function(index,cw){
			if( cw.isVisible() && cw.documents.length < a18Props.maxDocuments ){
				candidates.push(cw);


			}
		});
		var openNewWindow = function(){
			gui.addContentWindow();
			gui.updateNames();
			gui.contentWindows[gui.contentWindows.length-1].addTab(doc,page,type,position);
			if( ( !a18Props.resizable && !a18Props.draggable ) || a18Gui.automaticGridLayout ){
				if( a18Props.guiConfig ){
					gui.initialLayout();
				}
				else {
					gui.gridLayout();
				}
			}
		}
		if( candidates.length == 0 ){
			openNewWindow();
		}
		else {
			var close;
			var inner = $('<div class="inner"/>');
			$.each(candidates, function(index,cw){
				var openButton = $('<a>'+cw.getName()+'</a>').appendTo(inner);
				openButton.click(function(){
					cw.addTab(doc,page,type,position);
					close();
				});
			});
			var openNewButton = $('<a>'+Util.getString('newContentWindow')+'</a>').appendTo(inner);
			openNewButton.click(function(){
				openNewWindow();
				close();
			});
			var dialog = this.createDialog(Util.getString('openDocument'),inner,evt);
			close = function(){
				$(dialog).remove();
			}
		}
	};	
	
	/**
	* perfoms a search for a given <term> and a given <facet>-string
	* triggers addCategory method in browser (adds new result accordeon category)
	*/
	this.search = function( term, facet ){
		var gui = this;
		var cancel = false;
		var onclose = function(){
			cancel = true;
			gui.browser.stopProcessing();
		}
		this.browser.startProcessing(onclose);
		var query = a18Props.searchQuery.replace('QUERY_ID',term);
		if( facet != '' ){
			query += '&facet=' + facet;
		}
	    	$.get( query, function(xml){
			if( !cancel ){
		    		var results = [];
				$(xml).find('result').each(function(){
					var page = parseInt($(this).find('page').text());
					if( page == '' ){
						page = 1;
					}
					var text = $(this).find('fragment').find('body').find('p');
					var doc = $(this).find('doc').text();
					if( typeof results[doc] == 'undefined' ){
						results[doc] = [];
					}
				    	results[doc].push( { page: page, text: text } );
				});
				for( var i in Util.documents ){
					var id = Util.documents[i].title;
					if( typeof results[id] != 'undefined' ){
						gui.browser.addCategory(Util.documents[i],results[id]);
					}
				}
				gui.browser.stopProcessing();
			}
	    	});
	};

	/**
	* returns an id for each view <type> preparing magnetic links
	*/
	this.getIdByType = function(type){
		if( type == 'text' ){
			return 0;
		}
		else if( type == 'pages' ){
			return 1;
		}
		else if( type == 'thumbnails' ){
			return 2;
		}
		else if( type == 'images' ){
			return 3;
		}
		else if( type == 'tei' ){
			return 4;
		}
		else if( type == 'outline' ){
			return 5;
		}
		else if( type == 'tags' ){
			return 6;
		}
		else if( type == 'map' ){
			return 7;
		}
	};

	/**
	* returns the view type for a given <id> to resolve magnetic links
	*/
	this.getTypeById = function(id){
		if( id == 0 ){
			return 'text';
		}
		else if( id == 1 ){
			return 'pages';
		}
		else if( id == 2 ){
			return 'thumbnails';
		}
		else if( id == 3 ){
			return 'images';
		}
		else if( id == 4 ){
			return 'tei';
		}
		else if( id == 5 ){
			return 'outline';
		}
		else if( id == 6 ){
			return 'tags';
		}
		else if( id == 7 ){
			return 'map';
		}
	};

	/**
	* returns parameters to prepare magnetic link
	* folder: documents, selected tab
	* document: linked status, view, page, facetSelection
	*/
	this.getParams = function(){
		var gui = this;
		var getDelimitedString = function(delimiter,items){
			var string = '';
			for( var i=0; i<items.length; i++ ){
				if( i>0 ){
					string += delimiter;
				}
				string += items[i];
			}
			return string;
		};
		var getDocumentString = function(dialog){
			var items = [];
			items.push(dialog.document.title);
			var type = dialog.getDocType();
			items.push(gui.getIdByType(type));
			items.push(dialog.page);
			if( dialog.linked ){
				items.push('1');
			}
			else {
				items.push('0');
			}
			var facets = dialog.facetSelection;
			var facetString = '';
			for( var i=0; i<facets.length; i++ ){
				if( facets[i] ){
					facetString += '1';
				}
				else {
					facetString += '0';
				}
			}
			items.push(facetString);
			return getDelimitedString(',',items);
		};
		var getFolderString = function(folder){
			var strings = [];
			strings.push(folder.getSelectedTab());
			for( var i=0; i<folder.documentDialogs.length; i++ ){
				strings.push(getDocumentString(folder.documentDialogs[i]));
			}
			return getDelimitedString(';',strings);
		};	
		var strings = [];
		for( var i=0; i<gui.contentWindows.length; i++ ){
			strings.push(getFolderString(gui.contentWindows[i]));
		}
		return getDelimitedString('_',strings);
	};
	
	/**
	* initializes freezed view by resolving <params> from magnetic link
	*/
	this.setParams = function(params){
		var data = params.split('_');
		this.initializeWindows(data.length);
		for( var i=0; i<data.length; i++ ){
			var contentWindowParams = data[i].split(';');
			for( var j=1; j<contentWindowParams.length; j++ ){
				var documentParams = contentWindowParams[j].split(',');
				var document = Util.loadDocumentSync(documentParams[0]);
				var type = this.getTypeById(documentParams[1]);
				this.contentWindows[i].addTab(document,parseInt(documentParams[2]),type);
				if( documentParams[3] == '1' ){
					this.contentWindows[i].dialog().linkDialog();
				}
				var facets = [];
				var facetString = documentParams[4];
				for( var k=0; k<facetString.length; k++ ){
					if( facetString[k] == 0 ){
						facets.push(false);
					}
					else {
						facets.push(true);
					}
				}
				this.contentWindows[i].dialog().setFacetSelection(facets);
			}
			this.contentWindows[i].setSelectedTab(parseInt(contentWindowParams[0]));
			this.contentWindows[i].resize();
			this.contentWindows[i].resizeContent();
		}
		this.gridLayout();
	};
	
	/**
	* adds controls gridlayout, magnetic link and add new folder if true in A18Props
	*/
	this.addControls = function(){
		var gui = this;
		var controls = $('<div class="edition-tools"/>').appendTo('body');		
		if( a18Props.addable ){
			var addWindow = $('<a class="button-newwindow"><span class="visuallyhidden"></span>&nbsp;</a>').appendTo(controls);
			$(addWindow).attr('title',Util.getString('newContentWindow'));
			addWindow.click(function(){
				gui.addContentWindow();
				gui.updateNames();
				if( ( !a18Props.resizable && !a18Props.draggable ) || gui.automaticGridLayout ){
					if( a18Props.guiConfig ){
						gui.initialLayout();
					}
					else {
						gui.gridLayout();
					}
				}
			});
		}
				
		if( a18Props.magneticLink ){
			var linkList = $("<div/>");
			var updateLinks = function(){
				$(linkList).empty();
				if( gui.magneticLinks.length > 0 ){
					$("<p><hr/></p>").appendTo(linkList);
					var p = $("<p/>").appendTo(linkList);
					$("<div>"+Util.getString('generatedMagneticLinks')+"</div>").appendTo(p);
					for( var i=0; i<gui.magneticLinks.length; i++ ){
						var ml = gui.magneticLinks[i];
						var linkDiv = $("<div/>").appendTo(p);
						var link;
						if( ml.indexOf('goo.gl') == -1 ){
							link = $('<a target=_blank href="'+gui.magneticLinks[i]+'">MagneticLink</a>').appendTo(linkDiv);
						}
						else {
							link = $('<a target=_blank href="'+gui.magneticLinks[i]+'">'+gui.magneticLinks[i]+'</a>').appendTo(linkDiv);
						}
						$(link).css('border','none');
						$(link).css('box-shadow','none');
						$(link).css('background-color','white');
					}
				}
			}
			var generateMagneticLink = function(){
				var params = gui.getParams();
				var linkString = 'http://'+location.host+''+location.pathname+'?params='+params;
				jsonlib.fetch({
					url: a18Props.urlShortenerRequest,
				    	header: 'Content-Type: application/json',
				    	data: JSON.stringify({longUrl: linkString})
				}, function(response){
				    	var result = null;
				    	try {
				      		result = JSON.parse(response.content).id;
				      		if (typeof result != 'string') result = null;
						if( result != null ){
							gui.magneticLinks.push(result);
							updateLinks();
						}
				    	} catch (e) {
						gui.magneticLinks.push(linkString);
						updateLinks();
				    	}
				});
			}
			var magneticLink = $('<a class="button-magenticlink"><span class="visuallyhidden"></span>&nbsp;</a>').appendTo(controls);
			$(magneticLink).attr('title',Util.getString('magneticLink'));
			magneticLink.click(function(evt){
				var content = $("<div class='inner'/>");
				$(content).css("text-align","center");
				var p = $("<p/>").appendTo(content);
				$("<div>"+Util.getString('newMagneticLink')+"</div>").appendTo(p);
				var generateButton = $('<a>'+Util.getString('generate')+'</a>').appendTo(p);
				generateButton.click(function(){
					generateMagneticLink();
				});
				$(linkList).appendTo(p);
				gui.createDialog(Util.getString('magneticLink'),content,evt);
			});
		}

		if( a18Props.gridLayout && ( a18Props.resizable || a18Props.draggable ) ){
			var gridDiv = $('<div class="gridselector"/>').appendTo('body');
			var gridButton = $('<a class="normal"><span class="visuallyhidden"></span>&nbsp;</a>').appendTo(gridDiv);
			if( a18Props.automaticGridLayout ){
				gridButton.attr('title',Util.getString('enableGridLayout'));
			}
			else {
				gridButton.attr('title',Util.getString('gridLayout'));
			}
			gridButton.click(function(){
				gui.toggleGridLayout();
			});
			gui.toggleGridLayout = function(){
				if( a18Props.automaticGridLayout ){
					gui.automaticGridLayout = !gui.automaticGridLayout;
					if( gui.automaticGridLayout ){
						gridButton.attr('class','active');
						gridButton.attr('title',Util.getString('disableGridLayout'));
						if( a18Props.guiConfig ){
							gui.initialLayout();
						}
						else {
							gui.gridLayout();
						}
					}
					else {
						gridButton.attr('class','normal');
						gridButton.attr('title',Util.getString('enableGridLayout'));
					}
				}
				else {
					if( a18Props.guiConfig ){
						gui.initialLayout();
					}
					else {
						gui.gridLayout();
					}
				}
				$.each(gui.contentWindows.concat([gui.browser]),function(i,frame){
					frame.setWindowFunctionality(!gui.automaticGridLayout);
				});
			}

		}
						
	};

	/**
	* automatic grid layout, if user resizes browser
	*/
	$(window).resize(function(){
		a18Gui.gridLayout();
	});	
	
	/**
	* checks, if grid layout need to be done
	*/
	this.checkGrid = function(){
		if( this.automaticGridLayout ){
			if( a18Props.guiConfig ){
				this.initialLayout();
			}
			else {
				this.gridLayout();
			}
		}		
	};

	this.getMousePosition = function(e) {
		if (!e) {
			e = window.event;
		}
		var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
		return {
			top : e.pageY ? e.pageY : e.clientY,
			left : e.pageX ? e.pageX : e.clientX
		};
	};

}

a18Gui.initialize();
