function OutlineTree(xhtml,title){
	this.nodeStack = [];
	this.title = title;
	this.traverseNodes(xhtml[0]);
}

OutlineTree.prototype.traverseNodes = function(node){
	if( node.hasChildNodes() ){
		var k = node.firstChild;
		while (k != null) {
			this.nodeStack.push(k);
			var val = k.nodeValue;
			if( val == null ){
				this.traverseNodes(k);
			}
			k = k.nextSibling;
		}
	}
}

OutlineTree.prototype.generateTree = function(){
	var chapters = [];
	chapters.push({
		"title": "<a class='head-anchor'>"+this.title+"</a>",
		depth: -1,
		"children": []
	});
	for( var i in this.nodeStack ){
		var node = this.nodeStack[i];
		var nodeName = node.nodeName;
		if( nodeName.match(/^H\d{1,2}$/g) ){
			var depth = parseInt(nodeName.substring(1));
			chapters.push({
				"title": node.innerHTML,
				depth: depth,
				"children": []
			});
		}
	}
	for( var i=1; i<chapters.length; i++ ){
		for( var j=i-1; j>=0; j-- ){
			if( chapters[j].depth < chapters[i].depth ){
				chapters[j].children.push(chapters[i]);
				break;
			}
		}
	}
	return chapters[0];
}
