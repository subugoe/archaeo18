/*
* generates TEI tree for given <tei> document
*/
function TEITreeGenerator(tei){
	this.tei = tei;
}

/*
* generate tei tree
*/
TEITreeGenerator.prototype.generate = function(){
	var teiRoot = $(this.tei).children(':first-child');
	var teiData = [];
	this.traverseNode($(teiRoot),teiData);
	var teiTree = { "title": "&lt;" + teiRoot[0].nodeName + "&gt;", "children": teiData };
	return teiTree;
}

/*
* traverses given <node> recursively
*/
TEITreeGenerator.prototype.traverseNode = function( node, data ){
	var children = $(node).children();	
	for( var i=0; i<children.length; i++ ){
		var childData = [];
		this.traverseNode(children[i],childData);
		var attributes = this.traverseNodeAttributes(children[i]);
		var attributesString = "";
		if( attributes != null ){
			attributesString += ": ";
			for( var j=0; j<attributes.length; j++ ){
				if( j > 0 ){
					attributesString += ", ";
				}
				attributesString += attributes[j];
			}
		}
		if( children[i].hasChildNodes() ){
			var dummy = $.extend(true, [], childData);
			var counter = 0;
			childData = [];
			var k = children[i].firstChild;
			while (k != null) {
				var val = k.nodeValue;
				if( val != null ){
					if( val.replace(/\s+/g,'') != '' ){
						childData.push({"title": val})
					}
				}
				else {
					childData.push(dummy[counter]);
					counter++;
				}
				k = k.nextSibling;
			}
		}
		data.push({
			"title": "&lt;" + children[i].nodeName + "" + attributesString + "&gt;",
			"children": childData
		});
	}	
}

/*
* returns attribute string for given <node>
*/
TEITreeGenerator.prototype.traverseNodeAttributes = function(node){
	var attributes = null;
	if( node.attributes != null && node.attributes.length > 0 ){
		attributes = [];
		for( var i=0; i<node.attributes.length; i++ ){
			attributes.push(node.attributes[i].nodeName + "=" + node.attributes[i].nodeValue);
		}
	}
	return attributes;
}
