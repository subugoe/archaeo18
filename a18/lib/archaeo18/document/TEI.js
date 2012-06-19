TEI = function(doc,container,parent){

	this.type = "tei";

	var contentPanel = $('<div/>').appendTo(container);
	$(contentPanel).css('overflow','auto');
	$(container).css('position','relative');

	var context = this;
	var teiDownload = $("<div/>").appendTo(container);
	teiDownload.addClass("teiDownload");
	teiDownload.attr( "title", Util.getString('downloadTei') );
	teiDownload.click(function(){
		parent.fullscreen.downloadFullscreen(doc.tei);
	});
	
	this.display = function(){
		var context = this;
		var show = function(data){
			$(contentPanel).empty();
			$(data).appendTo(contentPanel);
		}
		var showTree = function(tree){
			context.treeDiv = $("<div/>");
			$(context.treeDiv).dynatree({
			      children: doc.tree
			});
			show(context.treeDiv);
			parent.fullscreen.removeFullscreen();
		}
		var generate = function(xml){
			var data = new TEITreeGenerator(xml,contentPanel);
			doc.tree = data.generate();
			showTree(doc.tree);
		}
		if( typeof doc.tree != 'undefined' ){
			setTimeout( function(){ parent.fullscreen.loaderFullscreen(); showTree(doc.tree); }, 10 );
		}
		else {
			$.ajax({
				url: doc.tei,
				dataType: "xml",
				error: function(errorObject){
					show(a18Gui.getErrorMessage(errorObject.status));
					parent.stopProcessing();
				},
				success: function(xml){
					parent.fullscreen.loaderFullscreen();
					setTimeout( function(){ generate(xml); }, 10 );
				}
			});
		}
	}

	this.resize = function(){
		$(contentPanel).css('height',$(container).height()+'px');
	};
	
}
