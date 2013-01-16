/**
* implements facet selector
*/
function FacetSelector(div){

	var selector = this;
	
	var facetsBar = document.createElement("div");
	$(div).append(facetsBar);

	/**
	* initializes facet selector checkboxes
	*/	
	var checkboxes = [];
	var facetSelection = [];
	var addFacet = function(facet,index){
		var entry = $("<div/>").appendTo(facetsBar);
		var checkbox = $("<input type='checkbox'>"+Util.getFacetLabel(facet)+"</input>").appendTo(entry);
		$(entry).css('color',facet.color);
		$(entry).css('margin-left','5px');
		$(entry).css('margin-right','5px');
		//$(entry).css('display','inline-block');
		$(entry).css('display','inline');
		facetSelection.push(false);
		checkboxes.push(checkbox);
		checkbox.click(function(){
			facetSelection[index] = !facetSelection[index];
			if( typeof selector.triggerFunc != 'undefined' ){
				selector.triggerFunc(facetSelection);
			}
		});
	}
	$.each(Util.facets,function(i,facet){
		if( facet.render ){
			addFacet(facet,i);
		}
		else {
			facetSelection.push(false);
			checkboxes.push(false);
		}
	});

	/**
	* sets trigger function when facet checkboxes change
	*/	
	this.setTriggerFunc = function(triggerFunc){
		this.triggerFunc = triggerFunc;
	};

	/**
	* return actual facet selection boolean array
	*/	
	this.getFacetSelection = function(){
		return facetSelection;
	};

	/**
	* returns facet string like 'placeName,persName,...'
	*/	
	this.getFacetString = function(){
		var facets = '';
		for( var i=0; i<facetSelection.length; i++ ){
			if( facetSelection[i] ){
				if( facets != '' ){
					facets += ',';
				}
				facets += Util.facets[i].facet.substring(4);
			}
		}
		return facets;
	};

	/**
	* sets facet selection (for magnetic link and linked views)
	*/	
	this.setFacetSelection = function(facets){
		if( typeof facets == 'undefined' ){
			return;
		}
		facetSelection = facets;
		for( var i=0; i<facets.length; i++ ){
			if( !checkboxes[i] ){
				continue;
			}
			if( facets[i] ){
				$(checkboxes[i]).attr('checked',true);
			}
			else {
				$(checkboxes[i]).attr('checked',false);
			}
		}
	};

	/**
	* activate a specific facet
	*/	
	this.activateFacet = function(name){
		var i = -1;
		for( var j=0; j<Util.facets.length; j++ ){
			if( Util.facets[j].render ){
				i++;
				if( Util.facets[j].facet == name ){
					$(checkboxes[i]).attr('checked',true);
					facetSelection[i] = true;
					break;
				}
			}
		}
	};

}
