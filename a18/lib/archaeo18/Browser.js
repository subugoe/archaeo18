/**
* A18 Browser for search and document list
*/
Browser = function(){
	
	/**
	* initializes browser window
	*/
	this.initializeBrowser = function(facets){
		var browser = this;

		var show = function(showSearch){
			if( showSearch ){
				browser.searchTypes.css('display','block');
				browser.documents.css('display','none');
				browser.searchTab.addClass('selected');
				browser.documentTab.removeClass('selected');
			} 
			else {
				browser.searchTypes.css('display','none');
				browser.documents.css('display','block');
				browser.searchTab.removeClass('selected');
				browser.documentTab.addClass('selected');
			} 
		}

		this.header = $("<div class='scope-selector'/>").appendTo(this.content);
		this.searchTab = $("<a>"+Util.getString('search')+"</a>").appendTo(this.header);
		this.documentTab = $("<a>"+Util.getString('documents')+"</a>").appendTo(this.header);
		this.searchTab.click(function(){
			show(true);
		});
		this.documentTab.click(function(){
			show(false);
		});
		var wa1 = $(this.searchTab).width();
		var wa2 = $(this.documentTab).width();
		var w1 = parseInt($(this.searchTab).css("padding-left"))*2+$(this.searchTab).width();
		var w2 = parseInt($(this.documentTab).css("padding-left"))*2+$(this.documentTab).width();
		var w = w1+w2;
		$(this.searchTab).css('padding-left',((w/2-wa1)/2)+'px');
		$(this.searchTab).css('padding-right',((w/2-wa1)/2)+'px');
		$(this.documentTab).css('padding-left',((w/2-wa2)/2)+'px');
		$(this.documentTab).css('padding-right',((w/2-wa2)/2)+'px');
		this.main = $("<div class='main'/>").appendTo(this.content);
		this.main.css('overflow-x','hidden');
		this.main.css('overflow-y','auto');
		this.main.css('position','relative');

		var selectedSearchType = 'simple';
		var toggleSearch = function(searchType){
			if( selectedSearchType == searchType ){
				browser.advancedSearch.css('display','none');
//				browser.proximitySearch.css('display','none');
				selectedSearchType = 'simple';
			} 
			else if( searchType == 'advanced' ){
				browser.advancedSearch.css('display','block');
//				browser.proximitySearch.css('display','none');
				selectedSearchType = searchType;
			} 
			else if( searchType == 'proximity' ){
				browser.advancedSearch.css('display','none');
//				browser.proximitySearch.css('display','block');
				selectedSearchType = searchType;
			} 
		}

		this.searchTypes = $('<div/>').appendTo(this.main);
		$(this.searchTypes).css('position','relative');

		var simpleSearch = $("<form/>").appendTo(this.searchTypes);
		this.searchField = $("<input type='text'/>").appendTo(simpleSearch);
		this.searchButton = $("<input type='submit' value=''/>").appendTo(simpleSearch);
		var search = function(){
			if( browser.searchField.val() != '' ){
				browser.clearSearch();
				if( selectedSearchType == 'simple' ){
					//browser.addSearchResultsTab(Util.getString('simpleSearch') + ' "' + searchField.val() + '"' );
					a18Gui.search( browser.searchField.val(), '' );
				}
				else if( selectedSearchType == 'advanced' ){
					browser.doAdvancedSearch();
				}
				else if( selectedSearchType == 'proximity' ){
//					browser.doProximitySearch();
				}
			}
		};
		simpleSearch.submit(function(evt){
			evt.preventDefault();
			search();
		});

		this.as = $("<div class='advancedSearch'/>").appendTo(this.searchTypes);
		this.advancedSearchTab = $("<span>"+Util.getString('advancedSearch')+"</span>").appendTo(this.as);
		//this.advancedSearchTab.css('display','inline');
		/*
		this.proximitySearchTab = $("<div>"+Util.getString('proximitySearch')+"</div>").appendTo(this.selectSearch);
		this.proximitySearchTab.css('display','inline');
		this.proximitySearchTab.css('float','right');
		this.proximitySearchTab.click(function(){
			toggleSearch('proximity');
		});
		*/
		this.advancedSearchTab.click(function(){
			toggleSearch('advanced');
		});

		//this.searchContainer = $("<div/>").appendTo(this.searchTypes);
		this.prepareAdvancedSearch();
		//this.prepareProximitySearch();

		this.documents = $('<div/>').appendTo(this.main);
		this.documents.css('overflow','auto')

		//$('<hr/>').appendTo(this.searchTypes);
		this.searchResults = $('<ul class="hits"/>').appendTo(this.searchTypes);

		show(a18Props.browserSearch);

		this.setLabel(this.getName());
		this.fullscreen = new FullscreenWindow(this.searchTypes);
		this.resizeContent();

	};

	/**
	* empties results list
	*/
	this.clearSearch = function(){
		$(this.searchResults).empty();
		this.searchTabs = [];
		this.searchContents = [];
	};

	/**
	* shows loader if search is performed
	*/
	this.startProcessing = function(onclose){
		this.fullscreen.loaderFullscreen(onclose);
	};

	/**
	* hides loader after search was performed
	*/
	this.stopProcessing = function(){
		this.fullscreen.removeFullscreen();
	};

	/**
	* builds advanced search items in old design
	*/
	this.prepareAdvancedSearch = function(){
		var browser = this;
		this.advancedSearch = $("<div/>").appendTo(this.as);

		var div1 = $('<div/>').appendTo(this.advancedSearch);
		$("<input id='allDocsSearch' type='radio' name='scope'>"+Util.getString('allDocuments')+"</input> "+Util.getString('or')+"<input id='selectedDocsSearch' type='radio' name='scope'>"+Util.getString('selectDocuments')+"</input>").appendTo(div1);

		var allDocuments = $('#allDocsSearch')[0];
		var selectDocuments = $('#selectedDocsSearch')[0];

		var documents = $('<div class="selectedDocsDisplay"/>').appendTo(this.advancedSearch);
		var documentList = $('<ul/>').appendTo(documents);
		//$(documents).css('display','none');
		$(documents).css('overflow','hidden');
		$(allDocuments).attr('checked',true);

		var docsSelected = false;
		var docsHeight;
		var documentSelection = [];
		var addDocument = function(document,index){
			var entry = $("<li/>").appendTo(documentList);
			var checkbox = $("<input type='checkbox'>"+document.name+"</input>").appendTo(entry);
			//$(checkbox).css('margin-left','20px');
			documentSelection.push(false);
			checkbox.click(function(){
				documentSelection[index] = !documentSelection[index];
			});
		}
		var loadDocs = function(){
			$.each(Util.documents,function(i,document){
				addDocument(document,i);
			});
			docsHeight = $(documents).height();
			$(documents).css('height','0px');
			$(documents).css('display','block');
		}

		var checkDocumentVisibility = function(){
			if( $(selectDocuments).attr('checked') && !docsSelected ){
				if( documentSelection.length == 0 ){
					loadDocs();
				}
				$(documents).animate({
					height: "+="+docsHeight,
				});
				docsSelected = true;
			}
			else if( !$(selectDocuments).attr('checked') && docsSelected ){
				$(documents).animate({
					height: "-="+docsHeight,
				});
				docsSelected = false;
			}
		}
		$(allDocuments).click(checkDocumentVisibility);
		$(selectDocuments).click(checkDocumentVisibility);

		var div2 = $("<div/>").appendTo(this.advancedSearch);
		$("<input id='textsSearch' type='radio' name='type'>"+Util.getString('texts')+"</input> "+Util.getString('or')+"<input id='facetsSearch' type='radio' name='type'>"+Util.getString('facets')+"</input>").appendTo(div2);

		var inTexts = $('#textsSearch')[0];
		var inFacets = $('#facetsSearch')[0];
		$(inTexts).attr('checked',true);

		var facets = $('<div class="facetOptions"/>').appendTo(this.advancedSearch);
		$(facets).css('display','none');
		$(facets).css('overflow','hidden');

		var structureFacets = $('<div class="facetList"/>').appendTo(facets);
		var structureHeader = $('<span class="facetsHeader">'+Util.getString('documentStructure')+'</span>').appendTo(structureFacets);
		var structureList = $('<ul/>').appendTo(structureFacets);

		var entityFacets = $('<div class="facetList"/>').appendTo(facets);
		var entitiesHeader = $('<span class="facetsHeader">'+Util.getString('entities')+'</span>').appendTo(entityFacets);
		var entitiesList = $('<ul/>').appendTo(entityFacets);

		var facetsSelected = false;
		var facetsHeight;
		var facetSelection = [];
		var addFacet = function(facet,index,div){
			var entry = $("<li/>").appendTo(div);
			var checkbox = $("<input type='checkbox'>"+Util.getFacetLabel(facet)+"</input>").appendTo(entry);
			//$(checkbox).css('margin-left','20px');
			facetSelection.push(false);
			checkbox.click(function(){
				facetSelection[index] = !facetSelection[index];
			});
		}
		var loadFacets = function(){
			$.each(Util.facets,function(i,facet){
				if( facet.render ){
					addFacet(facet,i,entitiesList);
				}
				else {
					addFacet(facet,i,structureList);
				}
			});
			facetsHeight = $(facets).height();
			$(facets).css('height','0px');
			$(facets).css('display','block');
		}

		var checkFacetVisibility = function(){
			if( $(inFacets).attr('checked') && !facetsSelected ){
				if( facetSelection.length == 0 ){
					loadFacets();
				}
				$(facets).animate({
					height: "+="+facetsHeight,
				});
				facetsSelected = true;
			}
			else if( !$(inFacets).attr('checked') && facetsSelected ){
				$(facets).animate({
					height: "-="+facetsHeight,
				});
				facetsSelected = false;
			}
		}
		$(inTexts).click(checkFacetVisibility);
		$(inFacets).click(checkFacetVisibility);

		this.doAdvancedSearch = function(){
			var facet = '';
			if( $(inFacets).attr('checked') ){
				for( var i in Util.facets ){
					if( facetSelection[i] ){
						if( facet != '' ){
							facet += ',';
						}
						facet += Util.facets[i].facet.substring(Util.facets[i].facet.indexOf(':')+1);
					}
				}
			}
			a18Gui.search( browser.searchField.val(), facet );
		};
		this.advancedSearch.css('display','none');
	};

	/*
	/**
	* prepared proximity search in old design
	*
	this.prepareProximitySearch = function(){
		var browser = this;

//		this.searchTypes.append('<h3><a href="#">' + Util.getString('proximitySearch') + '</a></h3>');

		this.proximitySearch = $("<div/>").appendTo(this.searchContainer);
//		var searchField = $("<input type='text' size='12'/>").appendTo(this.proximitySearch);

		var searchFields = [];
		var searchFieldArea = $("<div/>").appendTo(this.proximitySearch);

		var reset;
		var addSearchField = function(){
			var searchItem = $("<div/>").appendTo(searchFieldArea);
			$(searchItem).addClass('searchItem');

			var line1 = document.createElement('div');
			$(searchItem).append(line1);
			var entries = [];
			entries.push({
				name: Util.getString('near'),
				onclick: function(){}
			});
			entries.push({
				name: Util.getString('notNear'),
				onclick: function(){}
			});
			entries.push({
				name: Util.getString('followedBy'),
				onclick: function(){}
			});
			entries.push({
				name: Util.getString('notFollowedBy'),
				onclick: function(){}
			});
			var dropdown = new Dropdown(line1,entries,'selectOption');
			dropdown.setLanguage(a18Gui.getString);
			dropdown.setEntry();
	
			var incrementer = new Incrementer(line1,0,null);

			var line2 = $("<div/>").appendTo(searchItem);
			$(line2).addClass('searchField');
			var searchField = $("<input type='text' size='12'/>").appendTo(line2);

			var removeField = $("<div/>").appendTo(line2);
			$(removeField).addClass('smallButton removeField');
			removeField.click(function(){
				$(searchItem).remove();
				for( var i=0; i<searchFields.length; i++ ){
					if( searchFields[i].div == searchItem ){
						searchFields.splice(i,1);
					}
				}
			});
			searchFields.push({
				div: searchItem,
				incrementer: incrementer,
				dropdown: dropdown,
				field: searchField
			});
		}
		
		var reset = function(){
			$(searchFieldArea).empty();
			searchFields = new Array();
			addSearchField();
		}
		reset();

		var addField = $("<div/>").appendTo(this.proximitySearch);
		$(addField).addClass('smallButton addField');
		addField.click(function(){
			addSearchField();
		});

		var p3 = $('<p/>').appendTo(this.proximitySearch);
		$(p3).css('text-align','center');
		var resetButton = $("<div/>").appendTo(p3);
		resetButton.button({ label: Util.getString('reset') });
		$(resetButton).click(reset);

//		var searchButton = $("<div/>").appendTo(p3);
//		searchButton.button({ label: Util.getString('proximitySearch') });

		this.doProximitySearch = function(){
			var queryString = '';
			for( var i=0; i<searchFields.length; i++ ){
				var sf = searchFields[i];
				if( sf.field.val() != '' ){
					if( i>0 && queryString != '' ){
						queryString += '|';
					}
					queryString += sf.field.val();
					queryString += ',' + sf.dropdown.getValue();
					queryString += ',' + sf.incrementer.getValue();
				}
			}
		};

		this.proximitySearch.css('display','none');
//		searchButton.click(search);
	};
	*/

	/**
	* resizes browsers content div
	*/
	this.resizeContent = function(){
		var height = $(this.content).height();
		var diff1 = parseInt($(this.header).css("padding-bottom"))+parseInt($(this.header).css("padding-top"));
		diff1 += parseInt($(this.header).css("margin-bottom"))+parseInt($(this.header).css("margin-top"));
		var diff2 = parseInt($(this.main).css("padding-bottom"))+parseInt($(this.main).css("padding-top"));
		diff2 += parseInt($(this.main).css("margin-bottom"))+parseInt($(this.main).css("margin-top"));
		$(this.main).css('height',(height-this.header.height()-diff1-diff2)+'px');
		$(this.searchTypes).css('height',(height-this.header.height()-diff1-diff2)+'px');
		$(this.searchTypes).css('width',$(this.main).width()+'px');
		this.fullscreen.resize();
	};
	
	/**
	* returns the Browsers title
	*/
	this.getName = function(){
		return Util.getString('browser');
	}

	/**
	* adds a document (<doc>) to the documents list
	*/
	this.addDocument = function(doc){
		var browser = this;
		$.ajax({
			url: a18Props.outlineQuery.replace('DOC_ID',doc.title),
			dataType: "html",
			success: function(outline){
				var tempDiv = $("<div/>");
				$(outline).appendTo(tempDiv);
				var tree = new OutlineTree(tempDiv,doc.name);
				var outlineTree = tree.generateTree();
			    	var root = $("<div/>").appendTo(browser.documents);
				var setLinks = function(){
					var oldLinks = $('.dynatree-title',root);
					for( var i=0; i<oldLinks.length; i++ ){
						$(oldLinks[i]).remove();
					}
					var setEvents = function(node){
						var position = $(newLinks[i]).attr("name");
						$(node).unbind('click');
					    	$(node).click(function(evt){
							if( position == '' ){
						    		a18Gui.openDocument(evt,doc);
							}
							else {
						    		a18Gui.openDocument(evt,doc,undefined,'text',position);
							}
					    	});
						/*
						$(node).draggable({
							opacity: 0.7,
							helper: "clone",
							start: function( event, ui ) {
								var dragthing = $('.ui-draggable-dragging')[0];
								$(dragthing).appendTo($('#editionContainer')[0]);
								console.info($(node).position(),$(node).offset());
							}
						});
						*/
					}
					var newLinks = $('.head-anchor',root);
					for( var i=0; i<newLinks.length; i++ ){
						setEvents(newLinks[i]);
					}
				}
				var calcTree = function(){
					if( typeof $(root).dynatree == 'undefined' ){
						setTimeout(function(){ calcTree() }, 100);
					}
					else {
						$(root).dynatree({
							children: outlineTree,
							onRender: setLinks
						});
						setLinks();
					}
				}
				calcTree();
			}
		});
	};
	
	/**
	* adds <results> for a <doc> with hits for a performed search to the results accordeon 
	*/
	this.addCategory = function(doc,results){
		var browser = this;
		var searchTab = $('<li/>').appendTo(this.searchResults);
		var searchLink = $('<a>' + doc.name + ' (' + results.length + ')' + '</a>').appendTo(searchTab);
		var searchContent = [];
		var visible = false;
		$.each(results, function(index,result){
			var searchResult = $('<div class="clearfix"/>').appendTo(searchTab);
			searchContent.push(searchResult);
			$(searchResult).css('display','none');
			var thumb = $("<div class='searchresult-thumbnail'/>").appendTo(searchResult);
			var thumbDiv = $("<div class='dummyThumbSmall'/>").appendTo(thumb);
			$(thumbDiv).css('margin-bottom','20px');
			var thumbnail = $("<div class='loadme'/>").appendTo(thumbDiv);
			thumbnail.css('height',thumbDiv.height()+'px');
			thumbnail.css('width',thumbDiv.width()+'px');
			thumbnail.attr("innerHTML","<!--<img class='thumbnail' src='" + doc.imagePath+"80/"+doc.images[result.page-1] + "'/>-->");
		    	thumbDiv.click(function(){
		    		a18Gui.openDocument(doc,result.page,"images");
		    	});
			var textDiv = $("<p/>").appendTo(searchResult);
			$(textDiv).html(result.text);
		    	$(textDiv).click(function(evt){
		    		a18Gui.openDocument(evt,doc,result.page,"pages");
		    	});
		});
	    	$(searchLink).click(function(){
			visible = !visible;
			for( var i=0; i<searchContent.length; i++ ){
				if( visible ){
					$(searchContent[i]).css('display','block');
				}
				else {
					$(searchContent[i]).css('display','none');
				}
			}
			$('div.loadme',this.searchResults).lazyLoad(searchTab,imageLoad,1000);
	    	});
	};
	
};
