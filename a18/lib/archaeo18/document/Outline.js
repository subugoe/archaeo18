Outline = function(doc,container,parent){

	this.type = "outline";
	this.container = container;
	this.content;

	this.display = function(){
		var context = this;
		$(this.container).empty();
/*
		var show = function(){
			var content = {};
			$.extend(content,doc.outline);
			$(content).appendTo(context.container);
			$(content).find('a').each(function(){
				$(this).click(function(){
					parent.showTextAtPosition($(this).attr('name'));
				});
			});
		}
		if( typeof doc.outline != 'undefined' ){
		    	show();
		}
		else {
*/
			this.stopped = false;
			$.ajax({
				url: a18Props.outlineQuery.replace('DOC_ID',doc.title),
				dataType: "html",
				beforeSend: function() {
					parent.startProcessing();
				},
				error: function(errorObject){
					if( !context.stopped ){
						$(a18Gui.getErrorMessage(errorObject.status)).appendTo(context.container);
						parent.stopProcessing();
					}
				},
				success: function(outline){
					var outlineTmp = $(outline);
					if( !context.stopped ){
						$(outlineTmp).find('a').each(function(){							
							$(this).click(function(){
								parent.showTextAtPosition($(this).attr('name'));
							});
						});
						$(outlineTmp).appendTo(context.container);
						parent.stopProcessing();
					}
				}
			});
//		}
	}

}
