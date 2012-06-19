function Pagination(div,pages,tooltips){

	this.page = 0;
	var pagination = this;
	
	/*
	this.pageInfo = document.createElement('div');
	this.pageInfo.setAttribute('class','pageInfo');
	paginationBar.appendChild(this.pageInfo);
	this.pageInfo.innerHTML = pages+" "+tooltips('pages');
	*/

	var paginationBar = div;

	/*
	var firstPageLi = $('<li/>').appendTo(paginationBar);
	this.firstPage = $('<a class="tools-paginationbackward"/>').appendTo(firstPageLi);
	this.firstPage.title = tooltips('firstPage');
	this.firstPage.onclick = function(){
		pagination.page = 1;
		pagination.update();
	}
	*/

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
	for( var i=0; i<pages; i++ ){
		$('<option value="'+(i+1)+'">'+(i+1)+'</option>').appendTo(this.selectPageDropdown);
	}
	$(this.selectPageDropdown).change(function(){
		$("select option:selected",this.selectPageDropdown).each(function(){
			pagination.page = parseInt($(this).html());
			pagination.update();
		});
	});

	var nextPageLi = $('<li/>').appendTo(paginationBar);
	this.nextPage = $('<a class="tools-paginationforward"><span class="visuallyhidden"/></a>').appendTo(nextPageLi);
	this.nextPage.title = tooltips('nextPage');
	this.nextPage.click(function(){
		if( pagination.page < pages ){
			pagination.setPage(pagination.page+1);
		}
	});

	/*
	var lastPageLi = $('<li/>').appendTo(paginationBar);
	this.lastPage = $('<a class="tools-paginationforward"/>').appendTo(lastPageLi);
	this.lastPage.title = tooltips('lastPage');
	this.lastPage.onclick = function(){
		pagination.page = pages;
		pagination.update();
	}
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

	this.setTriggerFunc = function(triggerFunc){
		this.triggerFunc = triggerFunc;
	};

	this.update = function(avoidTrigger){
		if( this.page == 1 ){
//			this.previousPage.setAttribute('class','paginationButton previousPageDisabled');
//			this.firstPage.setAttribute('class','paginationButton firstPageDisabled');
		}
		else {
//			this.previousPage.setAttribute('class','paginationButton previousPageEnabled');
//			this.firstPage.setAttribute('class','paginationButton firstPageEnabled');
		}
		if( this.page == pages ){
//			this.nextPage.setAttribute('class','paginationButton nextPageDisabled');
//			this.lastPage.setAttribute('class','paginationButton lastPageDisabled');
		}
		else {
//			this.nextPage.setAttribute('class','paginationButton nextPageEnabled');
//			this.lastPage.setAttribute('class','paginationButton lastPageEnabled');
		}
		if( !avoidTrigger ){
			this.triggerFunc(this.page);
		}
	};

}
