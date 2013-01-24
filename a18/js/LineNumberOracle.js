/**
* tries to find right places for linenumbers which are inserted there
*/
function LineNumberOracle(xhtml,steps){
	this.nodeStack = [];
	this.steps = steps;
	this.traverseNodes(xhtml[0]);
	this.insertLineNumbers();
}

/**
* traverse all nodes of xhtml
*/
LineNumberOracle.prototype.traverseNodes = function(node){
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

/**
* insert line numbers
*/
LineNumberOracle.prototype.insertLineNumbers = function(){
	var lineCounter = 1;
	for( var i in this.nodeStack ){
		var node = this.nodeStack[i];
		if( node.nodeName == 'HR' && this.hasAttributeValue(node,'class','tei:pb') ){
			lineCounter = 1;
		}
		if( node.nodeName == 'BR' && this.hasAttributeValue(node,'class','tei:lb') ){
			for( var j=i; j>0; j-- ){
				var node2 = this.nodeStack[j-1];
				if( node2.nodeName == 'BR' || node2.nodeName == 'HR' || node2.nodeName == 'DIV' || node2.nodeName == 'P' ){
					var node3 = this.nodeStack[j];
					if( lineCounter % this.steps == 0 ){
						$("<div class='lineNumber'>"+lineCounter+"</div>").insertBefore(node3);
					}
					lineCounter++;
					break;
				}
			}
		}
	}
}

/**
* if <node> has attribute 'tei:pb'
*/
LineNumberOracle.prototype.hasAttributeValue = function(node,attribute,value){
	if( node.attributes != null && node.attributes.length > 0 ){
		for( var i=0; i<node.attributes.length; i++ ){
			var a = node.attributes[i];
			if( a.nodeName == attribute && a.nodeValue.contains(value) ){
				return true;
			}
		}
	}
	return false;
}
