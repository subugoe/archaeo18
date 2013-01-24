/*
* document class
*/
Document = function(id,title,name,preview,pages,tei,imagePath,images){

	// running doc index by a18gui
	this.id = id;

	// exist given title
	this.title = title;

	// document name
	this.name = name;

	// preview image
	this.preview = preview;

	// number of pages
	this.pages = pages;

	// tei doc
	this.tei = tei;

	// path to images
	this.imagePath = imagePath;

	// image links
	this.images = images;

	// cache variables to avoid multiple server requests
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
