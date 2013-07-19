/*
* scripts page implementation
*/
var Scripts = new function(){

	this.initialized = false;

	/*
	* initialize scripts page; load documents
	*/
	this.initialize = function(){

		this.initialized = true;
		
		var gui = this;

		this.selectionContainer = $("#scriptsSelection");
		$('<h2>' + Util.getString('scriptSelection') + '</h2>').appendTo(this.selectionContainer);

		this.selectionDropdown = $('<ul class="selectHandschriften"/>').appendTo(this.selectionContainer);

		var loadDocs = function(){
			if( Util.docsLoaded == 1 ){
				for (var i = 0; i < Util.documents.length; i++) {
					console.log(Util.documents[i]);
					$('<li id="'
							  + Util.documents[i].title
							  + '"><a>'
							  + Util.documents[i].name
							  + '</a></li>').appendTo(gui.selectionDropdown);
				}
				$(".selectHandschriften li").each(function() {
					$(this).click(function() {
						if ($(this).attr('id') != '') {
							$("a", this).addClass('selected');
							gui.showDocument($(this).attr('id'));
						}
					})
				});
			}
			else {
				if( Util.docsLoaded == -1 ){
					Util.loadDocuments();
				}
				setTimeout(function(){
					loadDocs();
				}, 100 );
			}
		}
		loadDocs();
		this.scriptContainer = $("#scriptContainer");
	};

	/*
	* show document with given <title>
	*/
	this.showDocument = function(title){
		if( title == Util.getString('selectHandwriting') ){
			return;
		}
		var doc = Util.getDoc(title);
		var gui = this;
		$(this.scriptContainer).empty();
		$.ajax({
			url: EditionProperties.metadataQuery.replace('DOC_ID',title),
			dataType: 'html',
			success: function(xhtml){
				$('<h2 class="head-handwriting" id=' + title + '>' + Util.getString('handwriting') + ': ' + title + '</h2>').appendTo(gui.scriptContainer);
				var width = ScriptsProps.hwImageWidth;
				var height = ScriptsProps.hwImageHeight;
				var imageDiv = $('<div/>').appendTo(gui.scriptContainer);
				var image = $('<img alt="" height="' + height + '" src="' + doc.preview + '" class="content-img-style2" />').appendTo(imageDiv);
				var contentDiv = $('<div/>').appendTo(gui.scriptContainer);
				$(xhtml).appendTo(contentDiv);
				$('span',contentDiv).each(function(){
					var lang = Util.getAttribute(this, 'xml:lang');
					if( Util.language != lang && this.className !== 'tei:date'){
						$(this).css('display','none');
					}
				});
			}
		});
	};
};

ScriptsProps = {
	// default size if manuscripts page image 
	hwImageHeight: 328,
	hwImageWidth: 359
};