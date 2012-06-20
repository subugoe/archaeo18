Document = function(id,title,name,preview,pages,tei,imagePath,images){

	this.id = id;
	this.title = title;
	this.name = name;
	this.preview = preview;
	this.pages = pages;
	this.tei = tei;
	this.imagePath = imagePath;
	this.images = images;

	this.fullText;
	this.pageCache = [];
	this.kmlCache = [];
	this.cloudCache = [];
	for( var i=0; i<this.pages; i++ ){
		this.pageCache.push(false);
		this.kmlCache.push(false);
		this.cloudCache.push(false);
	}

};
