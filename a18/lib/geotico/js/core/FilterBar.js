/**
 * @class FilterBar
 * Impelentation for FilterBar Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function FilterBar(parent,parentDiv){

	var bar = this;

	this.toolbar = document.createElement('div');
	this.toolbar.setAttribute('class','filterBar');
	parentDiv.appendChild(this.toolbar);

	this.filter = document.createElement('div');
	this.filter.setAttribute('class','smallButton filter');
	this.toolbar.appendChild(this.filter);
	this.filter.onclick = function(){
		parent.filtering();
	};

	this.filterInverse = document.createElement('div');
	this.filterInverse.setAttribute('class','smallButton filterInverse');
	this.toolbar.appendChild(this.filterInverse);
	this.filterInverse.onclick = function(){
		parent.inverseFiltering();
	};
	if( !STIStatic.inverseFilter ){
		this.filterInverse.style.display = 'none';
	}

	this.cancelSelection = document.createElement('div');
	this.cancelSelection.setAttribute('class','smallButton cancelSelection');
	this.toolbar.appendChild(this.cancelSelection);
	this.cancelSelection.onclick = function(){
		parent.deselection();
	};

	this.toolbar.style.display = "none";

	this.reset = function(show){
		return;
		if( show ){
			this.toolbar.style.display = "block";
		}
		else {
			this.toolbar.style.display = "none";
		}
		this.toolbar.style.left = parentDiv.offsetWidth+"px";
//		this.toolbar.style.right = "0px";
		this.toolbar.style.top = Math.floor(parentDiv.offsetHeight/2-this.toolbar.offsetHeight/2)+"px";
	};

};
