var Scripts = new function(){

	this.initialize = function(){
		
		var gui = this;

		Util.loadTexts();

		this.selectionContainer = $("#selectionContainer");
		$('<h2>'+Util.getString('scriptSelection')+'</h2>').appendTo(this.selectionContainer);
		$('<h3>'+Util.getString('directSelection')+'</h3>').appendTo(this.selectionContainer);
		$('<p>'+Util.getString('pleaseSelect')+'</p>').appendTo(this.selectionContainer);

		var form = $('<form/>').appendTo(this.selectionContainer);
		var fieldset = $('<fieldset/>').appendTo(form);
		this.selectionDropdown = $('<select class="selectHandschriften"/>').appendTo(fieldset);
		$(this.selectionDropdown).change(function(){
			$("select option:selected",this.selectionDropdown).each(function(){				
				gui.showDocument($(this).html());
			});
		});

		$('<option>'+Util.getString('selectHandwriting')+'</option>').appendTo(gui.selectionDropdown);

		var trigger = function(doc){
			$('<option>'+doc.title+'</option>').appendTo(gui.selectionDropdown);
		}
		Util.loadDocuments(trigger);

		this.scriptContainer = $("#scriptContainer");
		

	};

	this.showDocument = function(title){
		if( title == Util.getString('selectHandwriting') ){
			return;
		}
		var doc = Util.getDoc(title);
		var gui = this;
		$(this.scriptContainer).empty();
		$.ajax({
			url: a18Props.metadataQuery.replace('DOC_ID',title),
			async: false,
			dataType: 'html',
			success: function(xhtml){
				$('<h2 id='+title+'>'+Util.getString('handwriting')+': '+title+'</h2>').appendTo(gui.scriptContainer);
				var width = a18Props.hwImageWidth;
				var height = a18Props.hwImageHeight;
				var imageDiv = $('<div/>').appendTo(gui.scriptContainer);
				var imageSrc = doc.imagePath+""+height+"/"+doc.images[0];
				var image = $('<img alt="" height="'+height+'" src="'+imageSrc+'" class="content-img-style2" />').appendTo(imageDiv);
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

Scripts.initialize();