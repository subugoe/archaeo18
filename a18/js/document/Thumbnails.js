/*
* view to show thumbnail list
*/
Thumbnails = function(doc,container,parent){

	this.type = "thumbnails";
	this.container = container;
	this.path = doc.imagePath;
	this.images = doc.images;
	this.page;

	parent.hideLink();
		
	/*
	* display thumbnails with lazy load
	*/
	this.display = function(){
		var doc = this;
		var thumbnails = [];
		var appendClickFunction = function(image,page){
			image.click(function(){
				doc.page = page;
				doc.imageClicked();
			});
		}
		$.each(this.images,function(i,image){			
			var thumbDiv = $("<div/>").appendTo(doc.container);
			thumbDiv.addClass("dummyThumb");
			var thumbnail = $("<div class='loadme'/>").appendTo(thumbDiv);
			thumbnail.css('height',thumbDiv.height()+'px');
			thumbnail.css('width',thumbDiv.width()+'px');
			thumbnail.attr("innerHTML","<!--<img class='thumbnail' src='" + doc.path+"120/"+image + "'/>-->");
			appendClickFunction(thumbDiv,i+1);
	        });
		$('div.loadme').lazyLoad(this.container,imageLoad,1000);
	};
	
	/*
	* resize view
	*/
	this.resize = function(){
		$('div.loadme').trigger('scroll');
	};
	
	/*
	* appends click function on images
	*/
	this.setClickFunction = function(imageClicked){
		this.imageClicked = imageClicked;
	};
	
}
