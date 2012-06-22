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

		this.selectSearch = $("<div/>").appendTo(this.searchTypes);
		this.advancedSearchTab = $("<div>"+Util.getString('advancedSearch')+"</div>").appendTo(this.selectSearch);
		this.advancedSearchTab.css('display','inline');
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

		this.searchContainer = $("<div/>").appendTo(this.searchTypes);
		this.prepareAdvancedSearch();
		//this.prepareProximitySearch();

		this.documents = $('<div/>').appendTo(this.main);
		this.documents.css('overflow','auto')

		$('<hr/>').appendTo(this.searchTypes);
		this.searchResults = $('<ul class="hits"/>').appendTo(this.searchTypes);

		show(a18Props.browserSearch);

		this.setLabel(this.getName());
		this.resizeContent();

		this.label = $("<span/>").appendTo(this.toolbarDiv);

		this.fullscreen = new FullscreenWindow(this.main);

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
		this.advancedSearch = $("<div/>").appendTo(this.searchContainer);
		$("<p>"+Util.getString('in')+"</p>").appendTo(this.advancedSearch);

		var div1 = $('<div/>').appendTo(this.advancedSearch);
		var allDocuments = $("<input type='radio' name='scope'>"+Util.getString('allDocuments')+"</input>").appendTo(div1);
		var div2 = $('<div/>').appendTo(this.advancedSearch);
		var selectDocuments = $("<input type='radio' name='scope'>"+Util.getString('selectDocuments')+"</input>").appendTo(div2);
		var documents = $('<div/>').appendTo(div2);
		$(documents).css('display','none');
		$(documents).css('overflow','hidden');
		$(allDocuments).attr('checked',true);

		var docsSelected = false;
		var docsHeight;
		var documentSelection = [];
		var addDocument = function(document,index){
			var entry = $("<div/>").appendTo(documents);
			var checkbox = $("<input type='checkbox'>"+document.name+"</input>").appendTo(entry);
			$(checkbox).css('margin-left','20px');
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

		$("<p>"+Util.getString('in')+"</p>").appendTo(this.advancedSearch);
		var div3 = $('<div/>').appendTo(this.advancedSearch);
		var inTexts = $("<input type='radio' name='type'>"+Util.getString('texts')+"</input>").appendTo(div3);
		var div4 = $('<div/>').appendTo(this.advancedSearch);
		var inFacets = $("<input type='radio' name='type'>"+Util.getString('facets')+"</input>").appendTo(div4);
		var facets = $('<div/>').appendTo(div4);
		$(facets).css('display','none');
		$(facets).css('overflow','hidden');
		$(inTexts).attr('checked',true);

		var structureFacets = $('<div/>').appendTo(facets);
		$(structureFacets).addClass('facetList');
		var structureHeader = $('<div>'+Util.getString('documentStructure')+'</div>').appendTo(structureFacets);
		$(structureHeader).addClass('facetsHeader');

		var entityFacets = $('<div/>').appendTo(facets);
		$(entityFacets).addClass('facetList');
		var entitiesHeader = $('<div>'+Util.getString('entities')+'</div>').appendTo(entityFacets);
		$(entitiesHeader).addClass('facetsHeader');

		var facetsSelected = false;
		var facetsHeight;
		var facetSelection = [];
		var addFacet = function(facet,index,div){
			var entry = $("<div/>").appendTo(div);
			var checkbox = $("<input type='checkbox'>"+Util.getFacetLabel(facet)+"</input>").appendTo(entry);
			$(checkbox).css('margin-left','20px');
			facetSelection.push(false);
			checkbox.click(function(){
				facetSelection[index] = !facetSelection[index];
			});
		}
		var loadFacets = function(){
			$.each(Util.facets,function(i,facet){
				if( facet.render ){
					addFacet(facet,i,entityFacets);
				}
				else {
					addFacet(facet,i,structureFacets);
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
					var setClickEvent = function(node){
						var position = $(newLinks[i]).attr("name");
						$(node).unbind('click');
					    	$(node).click(function(){
							if( position == '' ){
						    		a18Gui.openDocument(doc);
							}
							else {
						    		a18Gui.openDocument(doc,undefined,'text',position);
							}
					    	});
					}
					var newLinks = $('.head-anchor',root);
					for( var i=0; i<newLinks.length; i++ ){
						setClickEvent(newLinks[i]);
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
		    	$(textDiv).click(function(){
		    		a18Gui.openDocument(doc,result.page,"pages");
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
