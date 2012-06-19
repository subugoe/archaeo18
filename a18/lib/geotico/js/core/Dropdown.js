/**
 * @class Dropdown
 * Implementation for Dropdown box
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function Dropdown(parent,elements,dropperTitle){

	var dropdown = this;
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
	dropdownButton.title = dropperTitle;

	this.getValue = function(){
		return this.selectedEntry.innerHTML;
	};

	var entryMenu = document.createElement("div");
	entryMenu.setAttribute('class','dropdownMenu');
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
	this.div.style.maxHeight = this.div.offsetHeight+"px";

	entryMenu.style.display = 'none';

	this.setEntry = function(index){
		if (typeof(index) == "undefined") {
		  if ((elements) && elements.length > 0) {
			  this.changeEntries(elements[0]);
		  }	
		} else {
			this.changeEntries(elements[index]);
		}
	}

	this.changeEntries = function(element){
		if( this.selectedEntry ){
			this.selectedEntry.setAttribute('class','dropdownUnselectedEntry');
		}
		this.selectedEntry = element.entry;
		this.selectedEntry.setAttribute('class','dropdownSelectedEntry');
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

}
