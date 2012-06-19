/**
 * @class TableWidget
 * Implementation for TableWidget Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

/**
 * @param {String} container the div for the container of the table widget
 *
 * @constructor
 */
function TableWidget(core,div){

	this.core = core;
	this.container = div;
	this.tables;
	this.hashMapping;

	this.gui = new TableGui(this,div);
	this.initialize();
    
}

TableWidget.prototype = {

	initTable: function(tableObjects,names){

		$(this.tabs).empty();
		$(this.input).empty();
		this.activeTable = undefined;
    		this.tables = [];
    		this.tableTabs = [];
    		this.tableElements = [];
    		this.tableHash = [];
		this.selectedObjects = [];
		this.filterBar.reset(false);

		var tableWidget = this;
		var addTab = function(name,index){
			var tableTab = document.createElement('div');
			tableTab.setAttribute('class','tableTab unselectedTableTab');
			tableTab.onclick = function(){
				tableWidget.selectTable(index);
			}
			tableTab.innerHTML = name;
			return tableTab;
		}

		for( var i in tableObjects ){
			this.selectedObjects.push([]);
			this.tableHash.push([]);
			var tableTab = addTab(names[i],i);
			this.tabs.appendChild(tableTab);
			this.tableTabs.push(tableTab);
			var elements = [];
			for( var j in tableObjects[i] ){
				elements.push(new TableElement(tableObjects[i][j]));				
				this.tableHash[i][tableObjects[i][j].index] = elements[elements.length-1];
			}
			var table = new Table(elements,this,i);
			this.tables.push(table);
			this.tableElements.push(elements);
		}
		
		if( tableObjects.length > 0 ){
			this.selectTable(0);
		}

	},

	selectTable: function(index){

		if( this.activeTable != index ){
			if( typeof this.activeTable != 'undefined' ){
				this.tables[this.activeTable].hide();
				this.tableTabs[this.activeTable].setAttribute('class','tableTab unselectedTableTab');
			}
			this.activeTable = index;
			this.tables[this.activeTable].show();
			this.tableTabs[this.activeTable].setAttribute('class','tableTab selectedTableTab');
			this.core.rise(index);
		}

	},

	initialize: function(){
		
		this.tabs = document.createElement('div');
		this.tabs.setAttribute('class','tableTabs');
		this.container.appendChild(this.tabs);

		this.input = document.createElement('div');
		this.input.setAttribute('class','tableInput');
		this.container.appendChild(this.input);

		this.filterBar = new FilterBar(this,this.container);

	},

	highlightChanged: function(data){
		for( var i=0; i<this.tableElements.length; i++ ){
			for( var j=0; j<this.tableElements[i].length; j++ ){
				this.tableElements[i][j].highlighted = false;
			}
		}
		for( var i=0; i<data.length; i++ ){
			var objects = data[i].objects;
			for( var j=0; j<objects.length; j++ ){
				for( var k=0; k<objects[j].length; k++ ){
					this.tableHash[j][objects[j][k].index].highlighted = true;
				}
			}
		}
		this.tables[this.activeTable].update();
	},

	selectionChanged: function(data){
		this.reset();
		for( var i=0; i<this.tableElements.length; i++ ){
			for( var j=0; j<this.tableElements[i].length; j++ ){
				this.tableElements[i][j].selected = false;
				this.tableElements[i][j].highlighted = false;
			}
		}
		for( var i=0; i<data.length; i++ ){
			var objects = data[i].objects;
			for( var j=0; j<objects.length; j++ ){
				for( var k=0; k<objects[j].length; k++ ){
					this.tableHash[j][objects[j][k].index].selected = true;
				}
			}
		}
		this.tables[this.activeTable].reset();
		this.tables[this.activeTable].update();
	},

	triggerHighlight: function(item){
		if( typeof item != 'undefined' ){
			var objects = [];
			for( var i=0; i<this.tables.length; i++ ){
				objects.push([]);
			}
			objects[this.activeTable].push(item);
			this.core.triggerHighlight( [{ value: 1, objects: this.selectedObjects }].concat([{ value: 1, objects: objects }]) );
		}
		else {
			this.core.triggerHighlight( [{ value: 1, objects: this.selectedObjects }] );
		}
	},

	tableSelection: function(){
		var filtering = false;
		for( var i=0; i<this.tables.length; i++ ){
			this.selectedObjects[i] = [];
		}
		for( var i=0; i<this.tableElements.length; i++ ){
			for( var j=0; j<this.tableElements[i].length; j++ ){
				var e = this.tableElements[i][j];
				if( e.selected ){
					this.selectedObjects[i].push(e.object);
					filtering = true;
				}
			}
		}
		this.core.triggerSelection( [{ value: 1, objects: this.selectedObjects }] );
		this.filterBar.reset(true);
	},

    deselection: function(){
	this.reset();
    	this.core.triggerSelection([]);
    },

    filtering: function(){
	this.core.triggerRefining(this.selectedObjects);
    },

    inverseFiltering: function(){
	var filtering = false;
	for( var i=0; i<this.tables.length; i++ ){
		this.selectedObjects[i] = [];
	}
	for( var i=0; i<this.tableElements.length; i++ ){
		for( var j=0; j<this.tableElements[i].length; j++ ){
			var e = this.tableElements[i][j];
			if( !e.selected ){
				this.selectedObjects[i].push(e.object);
				filtering = true;
			}
		}
	}
	this.filtering();
    },

	triggerRefining: function(){
		this.core.triggerRefining(this.selectedObjects);
	},

	setFilterBar: function(filterBar){
		this.filterBar = filterBar;
	},

	reset: function(){
		this.selectedObjects = [];
		this.filterBar.reset(false);
		this.tables[this.activeTable].resetElements();
		this.tables[this.activeTable].reset();
		this.tables[this.activeTable].update();
	}

}

function Table(elements,parent,id){

    this.elements = elements;
    this.showElementsLength = elements.length;
    this.parent = parent;
    this.id = id;

    this.validResultsPerPage = [ 10, 20, 50, 100 ];
    this.keyHeaderList = [];
    this.initialize();
    
}

Table.prototype = {

	initToolbar: function(){

		var table = this;

		this.toolbar = document.createElement("table");
		this.toolbar.setAttribute('class','ddbToolbar');
		this.tableDiv.appendChild(this.toolbar);

		var navigation = document.createElement("tr");
		this.toolbar.appendChild(navigation);
			
		var selectors = document.createElement("td");
		navigation.appendChild(selectors);

 		if( STIStatic.tableSelectPage ){
			var selectPageItems = true;
			this.selectPage = document.createElement('div');
			this.selectPage.setAttribute('class','paginationButton selectPage');
			this.selectPage.title = STIStatic.getString('selectTablePageItemsHelp');
			selectors.appendChild(this.selectPage);
			this.selectPage.onclick = function(){
				selectPageItems = !selectPageItems;
				if( selectPageItems ){
					var items = 0;
					for( var i=table.first; i<table.elements.length; i++ ){
						table.elements[i].selected = false;
						items++;
						if( items == table.resultsPerPage ){
							break;
						}
					}
					table.selectPage.setAttribute('class','paginationButton selectPage');
					table.selectPage.title = STIStatic.getString('selectTablePageItemsHelp');
				}
				else {
					var items = 0;
					for( var i=table.first; i<table.elements.length; i++ ){
						table.elements[i].selected = true;
						items++;
						if( items == table.resultsPerPage ){
							break;
						}
					}
					table.selectPage.setAttribute('class','paginationButton deselectPage');
					table.selectPage.title = STIStatic.getString('deselectTablePageItemsHelp');
				}
				table.update();
				table.parent.tableSelection();
			}
		}
		
 		if( STIStatic.tableSelectAll ){
			var selectAllItems = true;
			this.selectAll = document.createElement('div');
			this.selectAll.setAttribute('class','paginationButton selectAll');
			table.selectAll.title = STIStatic.getString('selectAllTableItemsHelp');
			selectors.appendChild(this.selectAll);
			this.selectAll.onclick = function(){
				selectAllItems = !selectAllItems;
				if( selectAllItems ){
					for( var i=0; i<table.elements.length; i++ ){
						table.elements[i].selected = false;
					}
					table.selectAll.setAttribute('class','paginationButton selectAll');
					table.selectAll.title = STIStatic.getString('selectAllTableItemsHelp');
				}
				else {
					for( var i=0; i<table.elements.length; i++ ){
						table.elements[i].selected = true;
					}
					table.selectAll.setAttribute('class','paginationButton deselectAll');
					table.selectAll.title = STIStatic.getString('deselectAllTableItemsHelp');
				}
				table.update();
				table.parent.tableSelection();
			}
		}

		this.showSelectedItems = false;
 		if( STIStatic.tableShowSelected ){
			this.showSelected = document.createElement('div');
			this.showSelected.setAttribute('class','paginationButton showSelected');
			table.showSelected.title = STIStatic.getString('showSelectedHelp');
			selectors.appendChild(this.showSelected);
			this.showSelected.onclick = function(){
				table.showSelectedItems = !table.showSelectedItems;
				if( table.showSelectedItems ){
					table.showElementsLength = 0;
					for( var i=0; i<table.elements.length; i++ ){
						if( table.elements[i].selected ){
							table.showElementsLength++;
						}
					}
					table.showSelected.setAttribute('class','paginationButton showAll');
//					table.selectAll.title = STIStatic.getString('showAllElementsHelp');
				}
				else {
					table.showElementsLength = table.elements.length;
					table.showSelected.setAttribute('class','paginationButton showSelected');
//					table.selectAll.title = STIStatic.getString('showSelectedHelp');
				}
				table.updateIndices(table.resultsPerPage);
				table.update();
			}
		}

//		selectors.style.width = (this.filter.offsetWidth + this.selectAll.offsetWidth + this.selectPage.offsetWidth)+"px";
		
		var results = document.createElement("td");
		navigation.appendChild(results);

		var pagination = document.createElement("td");
		navigation.appendChild(pagination);

		this.resultsInfo = document.createElement('div');
		this.resultsInfo.setAttribute('class','resultsInfo');
		results.appendChild(this.resultsInfo);

		this.firstPage = document.createElement('div');
		this.firstPage.setAttribute('class','paginationButton');
		this.firstPage.title = STIStatic.getString('paginationFirsPageHelp');
		
		pagination.appendChild(this.firstPage);
		this.firstPage.onclick = function(){
			if( table.page != 0 ){
				table.page = 0;
				table.update();
			}
		}

		this.previousPage = document.createElement('div');
		this.previousPage.setAttribute('class','paginationButton');
		this.previousPage.title = STIStatic.getString('paginationPreviousPageHelp');
		pagination.appendChild(this.previousPage);
		this.previousPage.onclick = function(){
			if( table.page > 0 ){
				table.page--;
				table.update();
			}
		}

		this.pageInfo = document.createElement('div');
		this.pageInfo.setAttribute('class','pageInfo');
		pagination.appendChild(this.pageInfo);

		this.nextPage = document.createElement('div');
		this.nextPage.setAttribute('class','paginationButton');
		this.nextPage.title = STIStatic.getString('paginationNextPageHelp');
		pagination.appendChild(this.nextPage);
		this.nextPage.onclick = function(){
			if( table.page < table.pages - 1 ){
				table.page++;
				table.update();
			}
		}

		this.lastPage = document.createElement('div');
		this.lastPage.setAttribute('class','paginationButton');
		this.lastPage.title = STIStatic.getString('paginationLastPageHelp');
		pagination.appendChild(this.lastPage);
		this.lastPage.onclick = function(){
			if( table.page != table.pages - 1 ){
				table.page = table.pages - 1;
				table.update();
			}
		}

		this.resultsDropdown = document.createElement('div');
		this.resultsDropdown.setAttribute('class','resultsDropdown');		
		pagination.appendChild(this.resultsDropdown);
		var itemNumbers = [];
		var addItemNumber = function(count,index){
			var setItemNumber = function(){
				table.updateIndices(count);
				table.update();
			}
			itemNumbers.push({
				name: count,
				onclick: setItemNumber
			});
		}
		for( var i=0; i<STIStatic.validResultsPerPage.length; i++ ){
			addItemNumber(STIStatic.validResultsPerPage[i],i);
		}
		var dropdown = new Dropdown(this.resultsDropdown,itemNumbers,'selectMapType');
		for( var i=0; i<STIStatic.validResultsPerPage.length; i++ ){
			if( STIStatic.initialResultsPerPage == STIStatic.validResultsPerPage[i] ){
				dropdown.setEntry(i);
				break;
			}
		}
		dropdown.div.title = STIStatic.getString('paginationDropdownHelp');

		this.elementList = document.createElement("table");
		this.elementList.setAttribute('class','resultList');
		this.tableDiv.appendChild(this.elementList);

		this.elementListHeader = document.createElement("tr");
		this.elementList.appendChild(this.elementListHeader);

		//vhz an empty cell for the selection
		var cell = document.createElement('th');
		this.elementListHeader.appendChild(cell);
		//~vhz

		if( typeof (this.elements[0]) == 'undefined' ){
			return;
		}

		var addSortButton = function(key){
			table.keyHeaderList.push(key);
			var cell = document.createElement('th');
			table.elementListHeader.appendChild(cell);
			var sort = document.createElement('div');
			cell.appendChild(sort);
			var span = document.createElement('div');
			span.setAttribute('class','headerLabel');
			span.innerHTML = key;
			cell.appendChild(span);
			sort.setAttribute('class','paginationButton sortAZ');
			sort.title = STIStatic.getString('sortAZHelp');
			var sortAZ = false;
			sort.onclick = function(){
				sortAZ = !sortAZ;
				if( sortAZ ){
					sort.setAttribute('class','paginationButton sortZA');
					sort.title = STIStatic.getString('sortZAHelp');
					table.sortAscending(key);
					table.update();
				}
				else {
					sort.setAttribute('class','paginationButton sortAZ');
					sort.title = STIStatic.getString('sortAZHelp');
					table.sortDescending(key);
					table.update();
				}
			}
		}
		for(var key in this.elements[0].object.tableContent){
			addSortButton(key);
		}

	},

	sortAscending: function(key){
		var sortFunction = function(e1,e2){
			if( e1.object.tableContent[key] < e2.object.tableContent[key] ){
				return -1;
			}
			return 1;
		}
		this.elements.sort(sortFunction);
	},

	sortDescending: function(key){
		var sortFunction = function(e1,e2){
			if( e1.object.tableContent[key] > e2.object.tableContent[key] ){
				return -1;
			}
			return 1;
		}
		this.elements.sort(sortFunction);
	},

	setPagesText: function(){
		var infoText = STIStatic.getString('pageInfo');
		infoText = infoText.replace('PAGES_ID',this.pages);
		infoText = infoText.replace('PAGE_ID',this.page+1);
		this.pageInfo.innerHTML = infoText;
	},

	setResultsText: function(){
		if( this.elements.length == 0 ){
			this.resultsInfo.innerHTML = '0 Results';
		}
		else {
			var infoText = STIStatic.getString('resultsInfo');
			var first = this.page * this.resultsPerPage + 1;
			var last = ( this.page + 1 == this.pages ) ? this.showElementsLength : first + this.resultsPerPage - 1;
			infoText = infoText.replace('RESULTS_FROM_ID',first);
			infoText = infoText.replace('RESULTS_TO_ID',last);
			infoText = infoText.replace('RESULTS_ID',this.showElementsLength);
			this.resultsInfo.innerHTML = infoText;
		}
	},

	updateIndices: function(rpp){
		if( typeof this.resultsPerPage == 'undefined' ){
			this.page = 0;
			this.resultsPerPage = 0;
		}
		var index = this.page * this.resultsPerPage;
		this.resultsPerPage = rpp;
		if( this.showSelectedItems ){
			index = 0;
		}
		this.pages = Math.floor ( this.showElementsLength / this.resultsPerPage );
		if( this.showElementsLength % this.resultsPerPage != 0 ){
			this.pages++;
		}
		this.page = Math.floor( index / this.resultsPerPage );
	},

	update: function(){
		var table = this;
		$(this.elementList).find("tr:gt(0)").remove();
		if( this.page == 0 ){
			this.previousPage.setAttribute('class','paginationButton previousPageDisabled');
			this.firstPage.setAttribute('class','paginationButton firstPageDisabled');
		}
		else {
			this.previousPage.setAttribute('class','paginationButton previousPageEnabled');
			this.firstPage.setAttribute('class','paginationButton firstPageEnabled');
		}
		if( this.page == this.pages - 1 ){
			this.nextPage.setAttribute('class','paginationButton nextPageDisabled');
			this.lastPage.setAttribute('class','paginationButton lastPageDisabled');
		}
		else {
			this.nextPage.setAttribute('class','paginationButton nextPageEnabled');
			this.lastPage.setAttribute('class','paginationButton lastPageEnabled');
		}
		this.setPagesText();
		this.setResultsText();
		if( this.showSelectedItems ){
			var start = this.page * this.resultsPerPage;
			var items = 0;
			for( var i=0; i<this.elements.length; i++ ){
				if( items == start ){
					this.first = i;
					break;
				}
				if( this.elements[i].selected ){
					items++;
				}
			}
		}
		else {
			this.first = this.page * this.resultsPerPage;
		}
		//this.last = ( this.page + 1 == this.pages ) ? this.elements.length : this.first + this.resultsPerPage;
		var c = STIStatic.colors[this.id];
		var itemSet = [];
		var clearDivs = function(){
			for( var i=0; i<itemSet.length; i++ ){
				if( !itemSet[i].e.selected ){
					itemSet[i].e.highlighted = false;
					$(itemSet[i].div).css('background-color',STIStatic.toolbarColor);
				}
			}
		}
		var setHighlight = function(item,div){
			var enter = function(){
				clearDivs();
				if( !item.selected ){
					item.highlighted = true;
					table.parent.triggerHighlight(item.object);
					$(div).css('background-color','rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
				}
			}
			var leave = function(){
				clearDivs();
				if( !item.selected ){
					table.parent.triggerHighlight();
				}
			}
			$(div).hover(enter,leave);
			$(div).mousemove(function(){
				if( !item.selected && !item.highlighted ){
					item.highlighted = true;
					table.parent.triggerHighlight(item.object);
					$(div).css('background-color','rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
				}
			});
		}
		var setSelection = function(item,div,checkbox){
			var click = function(e){
				var checked = $(checkbox).is(':checked');
				if( checked ){
					item.selected = true;
					item.highlighted = false;
				}
				else {
					item.selected = false;
					item.highlighted = true;
				}
				//if( e.target == div ){
				//	$(checkbox).attr('checked', !checked);
				//}
				table.parent.tableSelection();
			}
			//$(div).click(click);
			$(checkbox).click(click);
		}
		this.checkboxes = [];
		var items = 0;
		for( var i=this.first; i<this.elements.length; i++ ){			
			var e = this.elements[i];
			//vhz because of an error
			if (typeof(e) == "undefined") {
				continue;
			}
			if( this.showSelectedItems && !e.selected ){
				continue;
			}
			var itemRow = $("<tr/>").appendTo(this.elementList);
			var checkColumn = $("<td/>").appendTo(itemRow);
			var checkbox = $("<input type='checkbox'/>").appendTo(checkColumn);
			$(checkbox).attr('checked', e.selected);
			//for(var key in e.object.tableContent){ //vhz changed
			var makeSubtext = function(cell,text){
				var subtext = text.substring(0,STIStatic.tableContentOffset);
				subtext = subtext.substring(0,subtext.lastIndexOf(' '));
				subtext += ' ... ';
				var textDiv = $("<div style='display:inline-block;'/>").appendTo(cell);
				$(textDiv).html(subtext);
				var show = false;
				var fullDiv = $("<div style='display:inline-block;'><a href='javascript:void(0)'>\>\></a></div>").appendTo(cell);
				$(fullDiv).click(function(){
					show = !show;
					if( show ){
						$(textDiv).html(text);
						$(fullDiv).html('<a href="javascript:void(0)">\<\<</a>');
					}
					else {
						$(textDiv).html(subtext);
						$(fullDiv).html('<a href="javascript:void(0)">\>\></a>');
					}
				});
			}
			for (var k = 0; k <table.keyHeaderList.length; k++) {
				var key = table.keyHeaderList[k]; //vhz
				var text = e.object.tableContent[key];
				var cell = $("<td/>").appendTo(itemRow);
				if( STIStatic.tableContentOffset && text.length < STIStatic.tableContentOffset ){
					$(cell).html(text);
				}
				else {
					makeSubtext(cell,text);					
				}
			}
			if( e.selected || e.highlighted ){
				$(itemRow).css('background-color','rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
			}
			else {
				$(itemRow).css('background-color',STIStatic.toolbarColor);
			}
			itemSet.push({
				e: e,
				div: itemRow
			});
			setHighlight(e,itemRow);
			setSelection(e,itemRow,checkbox);
			this.checkboxes.push(checkbox);
			$(checkColumn).css('text-align','center');
			items++;
			if( items == this.resultsPerPage ){
				break;
			}
		}
	},

	show: function(){
		this.tableDiv.style.display = "block";
	},

	hide: function(){
		this.tableDiv.style.display = "none";
	},

	resetElements: function(){
		for( var i=0; i<this.elements.length; i++ ){
			this.elements[i].selected = false;
			this.elements[i].highlighted = false;
		}
	},

	reset: function(){
		this.showSelectedItems = false;
		this.showElementsLength = this.elements.length;
		this.showSelected.setAttribute('class','paginationButton showSelected');
		this.updateIndices(this.resultsPerPage);
	},

	initialize: function(){
		
		this.tableDiv = document.createElement("div");
		this.tableDiv.setAttribute('class','singleTable');
		this.parent.input.appendChild(this.tableDiv);

		this.initToolbar();

		this.input = document.createElement("div");
		this.input.setAttribute('class','tableInput');
		this.tableDiv.appendChild(this.input);

		this.tableDiv.style.display = 'none';
		this.updateIndices(STIStatic.initialResultsPerPage);

		this.update();

	}

}

function TableElement(object){

	this.object = object;
	this.selected = false;
	this.highlighted = false;
    
}
