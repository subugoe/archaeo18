var Util = {
	documents: [],
	facets: []
};

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

Util.getString = function(id){
	return Util.texts[id][Util.language];
};

Util.loadDocuments = function(trigger,loadMets){
	var gui = this;
	$.get( a18Props.documentEndpoint, function(xml){
		$(xml).find('doc').each(function(){
			Util.loadDocument($(this).find('id').text(),$(this).find('title').text(),$(this).find('preview').text(),trigger,loadMets);
		});
	});
};

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

Util.getDoc = function(title){
	for( var i in Util.documents ){
		if( Util.documents[i].title == title ){
			return Util.documents[i];
		}
	}
};

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

Util.getFacetLabel = function(facet){
	for( var i in facet.labels ){
		if( facet.labels[i].language == Util.language ){
			return facet.labels[i].label;
		}
	}
};

Util.getFacet = function(id){
	for( var i in Util.facets ){
		if( Util.facets[i].facet == id ){
			return Util.facets[i];
		}
	}
};

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
		var link = '<a title="'+tooltip+'" class="'+facet.facet+'" href="'+url+'" style="color:'+facet.color+';" target="_blank">'+text+'</a>';
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
