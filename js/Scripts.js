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
		$('<h2>'+Util.getString('scriptSelection')+'</h2>').appendTo(this.selectionContainer);

		var form = $('<form/>').appendTo(this.selectionContainer);
		var fieldset = $('<fieldset/>').appendTo(form);
		this.selectionDropdown = $('<select class="selectHandschriften"/>').appendTo(fieldset);

		$('<option>'+Util.getString('selectHandwriting')+'</option>').appendTo(gui.selectionDropdown);
		$(this.selectionDropdown).change(function(){
			$("select option:selected",this.selectionDropdown).each(function(){
				if( $(this).attr('id') != '' ){
					gui.showDocument($(this).attr('id'));
				}
			});
		});

		var loadDocs = function(){
			if( Util.docsLoaded == 1 ){
				for( var i=0; i<Util.documents.length; i++ ){
					$('<option id="'+Util.documents[i].title+'">'+Util.documents[i].name+'</option>').appendTo(gui.selectionDropdown);
				}
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
				$('<h2 class="head-handwriting" id='+title+'>'+Util.getString('handwriting')+': '+title+'</h2>').appendTo(gui.scriptContainer);
				var width = ScriptsProps.hwImageWidth;
				var height = ScriptsProps.hwImageHeight;
				var imageDiv = $('<div/>').appendTo(gui.scriptContainer);
				var image = $('<img alt="" height="'+height+'" src="'+doc.preview+'" class="content-img-style2" />').appendTo(imageDiv);
				var contentDiv = $('<div/>').appendTo(gui.scriptContainer);
				$(xhtml).appendTo(contentDiv);
				$('span',contentDiv).each(function(){
					var lang = Util.getAttribute(this,'xml:lang');
					if( Util.language != lang ){
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
