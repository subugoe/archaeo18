/**
* Utils for Archaeo18
*/
var Util = {
	documents: [],
	facets: []
};

/**
* gets an attribute with a given <attributeName> from a given <node>
*/
Util.getAttribute = function(node,attributeName){
	var value = $(node).attr(attributeName);
	if( typeof value == 'undefined' ){
		for( var i=0; i<node.attributes.length; i++ ){
			if( attributeName == node.attributes[i].name ){
				value = node.attributes[i].nodeValue;
				break;
			}
		}
	}
	return value;
};

/**
* loads language dependent texts from the file "config/tooltips.json"
*/
Util.loadTexts = function(){
	$.ajax({
		url: "a18/config/tooltips.json",
		async: false,
		dataType: 'json',
		success: function(json){
			Util.texts = json;
		}
	});
	if( typeof navigator.language != 'undefined' && navigator.language.indexOf("de") > -1  ){
		Util.language = "de";
	}
	else if( typeof navigator.browserLanguage != 'undefined' && navigator.browserLanguage.indexOf("de") > -1 ){
		Util.language = "de";
	}
	else {
		Util.language = "en";
	}
};

/**
* returns a given text for a given <id> depending on the browser language from the file "config/tooltips.json"
*/
Util.getString = function(id){
	return Util.texts[id][Util.language];
};

/**
* loads all available documents
*/
Util.loadDocuments = function(trigger,loadMets){
	var gui = this;
	$.get( a18Props.documentEndpoint, function(xml){
		$(xml).find('doc').each(function(){
			Util.loadDocument($(this).find('id').text(),$(this).find('title').text(),$(this).find('preview').text(),trigger,loadMets);
		});
	});
};

/**
* loads a single document asynchronously
*/
Util.loadDocument = function(title,name,preview,trigger,loadMets){
    	var tei = a18Props.teiUri.replace(/DOC_ID/g,title);
    	var mets = a18Props.metsUri.replace(/DOC_ID/g,title);
	var pages = $.ajax({
		url: a18Props.pageCountQuery.replace('DOC_ID',title),
		dataType: "xml",
		success: function(xml){
			var pageCount = $(xml).find('count').text();
		    	var imagePath, images = [];
			if( loadMets ){
				var metsDoc = $.ajax({
					url: mets,
					dataType: "xml",
					success: function(xml){
						$(xml).find('[nodeName="METS:mets"]').find('[nodeName="METS:fileSec"]').find('[nodeName="METS:fileGrp"]').first().find('[nodeName="METS:file"]').each(function(){
							var node = $(this).find('[nodeName="METS:FLocat"]')[0];
				       	    		var fullPath = Util.getAttribute(node,'xlink:href');
				       	    		images.push(fullPath.substring(fullPath.lastIndexOf("/")+1));
				       	    		if( !imagePath ){
				       	    			var dummy = fullPath.substring(0,fullPath.lastIndexOf("/"));
				       	    			imagePath = dummy.substring(0,dummy.lastIndexOf("/")+1);
				       	    		}
			       			});
						var doc = new Document(Util.documents.length,title,name,preview,pageCount,tei,imagePath,images);
						Util.documents.push(doc);
						if( typeof trigger == 'undefined' ){
							return doc;
						}
						else {
							trigger(doc);
						}
					}
				});
			}
			else {
				var doc = new Document(Util.documents.length,title,name,preview,pageCount,tei,imagePath,images);
				Util.documents.push(doc);
				if( typeof trigger == 'undefined' ){
					return doc;
				}
				else {
					trigger(doc);
				}
			}
		}
	});
};

/**
* loads a single document synchronously
*/
Util.loadDocumentSync = function(title){
    	var tei = a18Props.teiUri.replace(/DOC_ID/g,title);
    	var mets = a18Props.metsUri.replace(/DOC_ID/g,title);
	var pageCount;
	var pages = $.ajax({
		async: false,
		url: a18Props.pageCountQuery.replace('DOC_ID',title),
		dataType: "xml",
		success: function(xml){
			pageCount = $(xml).find('count').text();
		}
	});
    	var imagePath, images = [];
	var metsDoc = $.ajax({
		async: false,
		url: mets,
		dataType: "xml",
		success: function(xml){
			$(xml).find('[nodeName="METS:mets"]').find('[nodeName="METS:fileSec"]').find('[nodeName="METS:fileGrp"]').first().find('[nodeName="METS:file"]').each(function(){
				var node = $(this).find('[nodeName="METS:FLocat"]')[0];
	       	    		var fullPath = Util.getAttribute(node,'xlink:href');
	       	    		images.push(fullPath.substring(fullPath.lastIndexOf("/")+1));
	       	    		if( !imagePath ){
	       	    			var dummy = fullPath.substring(0,fullPath.lastIndexOf("/"));
	       	    			imagePath = dummy.substring(0,dummy.lastIndexOf("/")+1);
	       	    		}
       			});
		}
	});
	var doc = new Document(0,title,'','',pageCount,tei,imagePath,images);
	return doc;
};

/**
* returns a document for a given <title>
*/
Util.getDoc = function(title){
	for( var i in Util.documents ){
		if( Util.documents[i].title == title ){
			return Util.documents[i];
		}
	}
};

/**
* loads all facets and <trigger>s function if done
*/
Util.loadFacets = function(trigger){
	var i = 0;
	$.ajax({
		url: a18Props.facetsQuery,
		dataType: "xml",
		async: false,
		success: function(xml){
			$(xml).find('[nodeName="tei:tei"]').children().each(function(){
				var labels = [];
				$(this).find('foreign').each(function(){
					labels.push({
						language: Util.getAttribute(this,'xml:lang'),
						label: $(this).text()
					});
				});
				var render = $(this).attr("rend");
				var color = undefined;
				if( render ){
					var dummy = $("<div class='entity"+i+"'/>").appendTo('body');
					color = $(dummy).css('color');
					$(dummy).remove();
					i++;
				}
				var facet = {
					facet: this.nodeName,
					render: render,
					labels: labels,
					color: color
				};
				Util.facets.push(facet);
				if( typeof trigger != 'undefined' && render ){
					trigger(facet);
				}
			});
		}
	});
};

/**
* returns a facet label for a given facet depending on the browser language
*/
Util.getFacetLabel = function(facet){
	for( var i in facet.labels ){
		if( facet.labels[i].language == Util.language ){
			return facet.labels[i].label;
		}
	}
};

/**
* returns a facet json for a given id
*/
Util.getFacet = function(id){
	for( var i in Util.facets ){
		if( Util.facets[i].facet == id ){
			return Util.facets[i];
		}
	}
};

/**
* returns a specific number (a18Props.maxTags) of tags from the given xml file <tags>
*/
Util.getTags = function(tags){
	var tagArray = [];
	for( var i=0; i<tags.length; i++ ){
		var text = $(tags[i]).find('tag').text();
		if( text == "" ){
			continue;
		}
		var weight = $(tags[i]).find('count').text();
		var url = $(tags[i]).find('link').text();
		var facet = Util.getFacet($(tags[i]).find('facet').text());
		var tooltip = weight+" "+Util.getString('occurences');
		var link = '<a title="'+tooltip+'" class="tagcloudTag '+facet.facet+'" href="'+url+'" style="color:'+facet.color+';" target="_blank">'+text+'</a>';
		tagArray.push({
			text: link,
			weight: weight
		});
		if( a18Props.maxTags && a18Props.maxTags == tagArray.length ){
			break;
		}
	}
	return tagArray;
};

/**
* returns an error message div of given <errorType> (e.g. 404) 
*/
Util.getErrorMessage = function(errorType){
	var errorDiv = $("<div/>");
	$("<div class='errorMessage'>"+Util.getString('errorMessage')+' ('+errorType+')'+"</div>").appendTo(errorDiv);
	$('<div class="errorSign"/>').appendTo(errorDiv);
	return errorDiv;
};

/**
* returns an alert message div with a given message (<msg>) 
*/
Util.getAlertMessage = function(msg){
	var alertDiv = $("<div/>");
	$("<div class='alertMessage'>"+msg+"</div>").appendTo(alertDiv);
	$('<div class="alertSign"/>').appendTo(alertDiv);
	return alertDiv;
};

/**
* replaces special characters with hex code
*/
Util.asciiToHex = function(text){
	var ascii = new Array( "!","#","$","%","&","'","(",")","*","+",",","/",":",";","=","?","@","[","]", " " );
	var hex = new Array( "%21","%23","%24","!$#","%26","%27","%28","%29","%2a","%2b","%2c","%2f","%3a","%3b","%3d","%3f","%40","%5b","%5d","%20" );
	for( var i=0; i<ascii.length; i++ ){
		while(text.indexOf(ascii[i])!= -1){
			text = text.replace(ascii[i],hex[i]);	
		}
	}
	text = text.replace(/!$#/g,"%25");
	return text;
};

/**
* method required for lazy loading
*/
var imageLoad = function(response,image,div){
	var width = div.width(), height = div.height();
	var w = response.naturalWidth || response.width, h = response.naturalHeight || response.height;
	if( typeof w != "undefined" && w > 0 ){
		if( h > height ){
			image.attr('height',height);
			h = height;
		}
		if( w > width ){
			image.attr('width',width);
			w = width;
		}
		var top = (height-$(image).height())/2;
		var left = (width-$(image).width())/2;
		image.css('position','absolute');
		image.css('top',top+'px');
		image.css('left',left+'px');
		image.parent().css("background-image","none");
	}
}
