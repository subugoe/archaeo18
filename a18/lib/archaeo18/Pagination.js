/*
* pagination for document views/dialog
*/
function Pagination(div,pages,tooltips){

	this.page = 0;
	var pagination = this;
	
	this.pages = pages;

	var paginationBar = div;

	// previous page button
	var previousPageLi = $('<li/>').appendTo(paginationBar);
	this.previousPage = $('<a class="tools-paginationbackward"><span class="visuallyhidden"/></a>').appendTo(previousPageLi);
	this.previousPage.title = tooltips('previousPage');
	this.previousPage.click(function(){
		if( pagination.page > 1 ){
			pagination.setPage(pagination.page-1);
		}
	});

	var form = $('<form/>').appendTo(paginationBar);
	form.css('display','inline');
	this.selectPageDropdown = $('<select/>').appendTo(paginationBar);
	for( var i=0; i<this.pages; i++ ){
		$('<option value="'+(i+1)+'">'+(i+1)+'</option>').appendTo(this.selectPageDropdown);
	}
	$(this.selectPageDropdown).change(function(){
		$("select option:selected",this.selectPageDropdown).each(function(){
			pagination.page = parseInt($(this).html());
			
			pagination.update();
		});
	});

	// next page button
	var nextPageLi = $('<li/>').appendTo(paginationBar);
	this.nextPage = $('<a class="tools-paginationforward"><span class="visuallyhidden"/></a>').appendTo(nextPageLi);
	this.nextPage.title = tooltips('nextPage');
	this.nextPage.click(function(){
		if( pagination.page < pagination.pages ){
			pagination.page = parseInt(pagination.page + 1);
			pagination.setPage(pagination.page);
		}
	});

	/*
	* set page in paginator and triggers triggerFunc if avoidTrigger=false
	*/
	this.setPage = function(page,avoidTrigger){
		this.page = page;
		$('select option:selected',this.selectPageDropdown).removeAttr('selected');
		$("option",this.selectPageDropdown).each(function(){
			if( pagination.page == parseInt($(this).html()) ){
				$(this).attr('selected','selected');
			}
		});
		this.update(avoidTrigger);
	};

	/*
	* sets funtion triggerFunc triggers when page change
	*/
	this.setTriggerFunc = function(triggerFunc){
		this.triggerFunc = triggerFunc;
	};

	/*
	* updates pagination buttons
	*/
	this.update = function(avoidTrigger){
		if( this.page == 1 ){
			$(this.previousPage).addClass('disabled');
		}
		else {
			$(this.previousPage).removeClass('disabled');
		}
		if( this.page == this.pages ){
			$(this.nextPage).addClass('disabled');
		}
		else {
			$(this.nextPage).removeClass('disabled');
		}
		if( !avoidTrigger ){
			this.triggerFunc(this.page);
		}
	};

}
