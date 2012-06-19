function FacetSelector(div){

	var selector = this;
	
	var facetsBar = document.createElement("div");
	$(div).append(facetsBar);

	var checkboxes = [];
	var facetSelection = [];
	var addFacet = function(facet,index){
		var entry = $("<div/>").appendTo(facetsBar);
		var checkbox = $("<input type='checkbox'>"+Util.getFacetLabel(facet)+"</input>").appendTo(entry);
		$(entry).css('color',facet.color);
		$(entry).css('margin-left','5px');
		$(entry).css('margin-right','5px');
		$(entry).css('display','inline-block');
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
	/*
	var set = $("<a href='javascript:void(0)'>Set!</a>").appendTo(facetsBar);	
	$(set).css('margin-left','5px');
	$(set).css('margin-right','5px');
	$(set).click(function(){
		trigger(facetSelection);
	});
	*/

	this.setTriggerFunc = function(triggerFunc){
		this.triggerFunc = triggerFunc;
	};

	this.getFacetSelection = function(){
		return facetSelection;
	};

	this.getFacetString = function(){
		var facets = '';
		for( var i=0; i<facetSelection.length; i++ ){
			if( facetSelection[i] ){
				if( facets != '' ){
					facets += ',';
				}
				facets += Util.facets[i].facet;
			}
		}
		return facets;
	};

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

}
