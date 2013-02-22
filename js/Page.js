var showDiv = function(div,link){
		$('#start_page').css('display','none');
		$('#edition_page').css('display','none');
		$('#indices_page').css('display','none');
		$('#manuscripts_page').css('display','none');
		$('#help_page').css('display','none');
		$('#terms_page').css('display','none');
		$('#databases_page').css('display','none');
		$('#people_page').css('display','none');
		$('#imprint_page').css('display','none');
		$('#linkstart').removeClass('selected');
		$('#linkedition').removeClass('selected');
		$('#linkindices').removeClass('selected');
		$('#linkhandschriften').removeClass('selected');
		if( typeof link != 'undefined' ){
			$(link).addClass('selected');
		}
		$(div).css('display','block');
	}

	var loadPage = function(){
		if( window.location.href.indexOf('?params') != -1 ){
			showDiv('#edition_page','#linkedition');
			EditionGui.gridLayout();
		} else if( window.location.href.indexOf('?page=') != -1 ){
			var data = window.location.href.split('?page=')[1];
			var page = data, link;
			if( data.indexOf('&link=') != -1 ){
				var data2 = data.split('&link=');
				page = data2[0];
				link = data2[1];
			}			
			showDiv(page,link);
		} else {
			showDiv('#start_page','#linkstart');
		}
	}
	loadPage();

	$('#linkstart').click(function(){
		showDiv('#start_page','#linkstart');
		location.hash = "?page=#start_page&link=#linkstart";
	});

	$('#linkedition').click(function(){
		showDiv('#edition_page','#linkedition');
		EditionGui.gridLayout();
		location.hash = "?page=#edition_page&link=#linkedition";
	});

	$('#linkindices').click(function(){
		showDiv('#indices_page','#linkindices');
		Indices.checkDisplay();
		location.hash = "?page=#indices_page&link=#linkindices";
	});

	$('#linkhandschriften').click(function(){
		showDiv('#manuscripts_page','#linkhandschriften');
		location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	});

	$('#linkstart2').click(function(){
		showDiv('#start_page','#linkstart');
		location.hash = "?page=#start_page&link=#linkstart";
	});

	$('#linkedition2').click(function(){
		showDiv('#edition_page','#linkedition');
		EditionGui.gridLayout();
		location.hash = "?page=#edition_page&link=#linkedition";
	});

	$('#linkindices2').click(function(){
		showDiv('#indices_page','#linkindices');
		Indices.checkDisplay();
		location.hash = "?page=#indices_page&link=#linkindices";
	});

	$('#linkhandschriften2').click(function(){
		showDiv('#manuscripts_page','#linkhandschriften');
		location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	});

	$('#linkhelp').click(function(){
		showDiv('#help_page','#linkhelp');
		location.hash = "?page=#help_page";
	});

	$('#linkterms').click(function(){
		showDiv('#terms_page','#linkhelp');
		location.hash = "?page=#terms_page";
	});

	$('#linkimprint').click(function(){
		showDiv('#imprint_page','#linkimprint');
		location.hash = "?page=#imprint_page";
	});

	$('#linkdatabases').click(function(e){
		showDiv('#databases_page','#linkdatabases',e);
		location.hash = "?page=#databases_page";
	});

	$('#linkpeople').click(function(e){
		showDiv('#people_page','#linkpeople',e);
		location.hash = "?page=#people_page";
	});

	window.onhashchange = function(){
		loadPage();
	};

	EditionGui.initialize({
		hyperlinkWindow: false
	});
