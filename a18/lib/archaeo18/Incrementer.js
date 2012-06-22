/**
* used in old design for index in- and decrementaion; not used in new design
*/
Incrementer = function(parent,min,max){

	var incrementer = this;
	this.visibility = false;
	this.div = document.createElement("div");
	this.div.setAttribute('class','dropdown');

	this.selection = document.createElement("div");
	this.selection.setAttribute('class','dropdownSelection');
	parent.appendChild(this.div);

	var leftBorder = document.createElement("div");
	leftBorder.setAttribute('class','dropdownLeft');
	this.div.appendChild(leftBorder);

	this.div.appendChild(this.selection);

	var dropdownButton = document.createElement("div");
	this.div.appendChild(dropdownButton);
	dropdownButton.setAttribute('class','incrementer');

	var increase = document.createElement("div");
	dropdownButton.appendChild(increase);
	increase.setAttribute('class','incrementerButton increase');

	var decrease = document.createElement("div");
	dropdownButton.appendChild(decrease);
	decrease.setAttribute('class','incrementerButton decrease');

	var index = 0;
	this.selection.innerHTML = index;

	decrease.onclick = function(){
		if( min != null && index > min || min == null ){
			index--;
			incrementer.selection.innerHTML = index;
		}
	}

	increase.onclick = function(){
		if( max != null && index < max || max == null ){
			index++;
			incrementer.selection.innerHTML = index;
		}
	}

	this.getValue = function(){
		return index;
	}

/*
	if( elements.length > 1 ){
		dropdownButton.setAttribute('class','dropdownButtonEnabled');
	}
	else {
		dropdownButton.setAttribute('class','dropdownButtonDisabled');
	}
	dropdownButton.onclick = function(){
		if( elements.length > 1 ){
			dropdown.changeVisibility();
		}
	}

	var entryMenu = document.createElement("div");
	entryMenu.setAttribute('class','ddbMapsMenu');
	this.div.appendChild(entryMenu);

	var entries = document.createElement("dl");
	var addEntry = function(e){
		var entry = document.createElement("dt");
		entry.innerHTML = e.name;
		entry.onclick = function(){
			e.onclick();
			dropdown.changeVisibility();
			dropdown.changeEntries(e);
		}
		entries.appendChild(entry);
		e.entry = entry;
	}
	for( var i=0; i<elements.length; i++ ){
		addEntry(elements[i]);
	}
	entryMenu.appendChild(entries);
	this.selection.style.width = entryMenu.offsetWidth+"px";
	entryMenu.style.width = (entryMenu.offsetWidth+leftBorder.offsetWidth+dropdownButton.offsetWidth-2)+"px";

	entryMenu.style.display = 'none';

	this.setEntry = function(index){
		if (typeof(index) == "undefined") {
		  if ((elements) && elements.length > 0) {
			  this.changeEntries(elements[0]);
		  }	
		} else {
			this.changeEntries(elements[index-1]);
		}
	}

	this.changeEntries = function(element){
		if( this.selectedEntry ){
			this.selectedEntry.setAttribute('class','dbbUnselectedMapEntry');
		}
		this.selectedEntry = element.entry;
		this.selectedEntry.setAttribute('class','dbbSelectedMapEntry');
		this.selection.innerHTML = "<div style='display:inline-block;vertical-align:middle;'>"+element.name+"</div>";
	}

	this.changeVisibility = function(){
		this.visibility = !this.visibility;
		if( this.visibility ){
			entryMenu.style.display = "block";
		}
		else {
			entryMenu.style.display = "none";
		}
	}

    this.setLanguage = function(tooltips){
    	if( elements.length > 1 ){
    		dropdownButton.title = tooltips('selectPage');
    	}
    	else {
    		dropdownButton.title = tooltips('singlePage');
    	}
    }
*/
}
