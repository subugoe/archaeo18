/* HEADER */

var headerState = $.cookie('header');
if ($.cookie('header') == 'header-small') {
	$('html').toggleClass('header-small');
	$('.header-button').removeClass('header-button-close').addClass('header-button-open');
}
$('.header-button').click(function() {
	//console.log('(1) Header Button clicked');
	//console.log('(2) Header State: ' + headerState);
	//console.log('(2) Header State (noch mal): ' + $.cookie('header'));
	if ($.cookie('header') == 'header-small') {
		//console.log('(3) make header big');
		$.cookie('header', '');
		$('html').toggleClass('header-small', '');
		$('.header-button').removeClass('header-button-open').addClass('header-button-close');
	} else {
		//console.log('(3) make header small');
		$.cookie('header', 'header-small');
		$('html').toggleClass('header-small');
		$('.header-button').removeClass('header-button-close').addClass('header-button-open');
	}
});

/* HEADER (end) */



/* SET FOOTER DIV HEIGHT */

$('footer .wrap div:first-child').height(215);
$('footer .wrap div:nth-child(2)').height(126);
$('footer .wrap div:nth-child(3)').height(106);

/* SET FOOTER DIV HEIGHT (end) */


/* MAKE TABLES DATA READY */

//$('#tableHandschriften').dataTable();
/*
$('#tableIncices').dataTable( {
	"aoColumns": [
	null,
	null,
	{ "bSortable": false }
	]
});
*/
//$('#tableIncices').dataTable();

/* MAKE TABLES DATA READY (end) */


/* MISC */

var filename = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
if (filename == 'start.php') { $('#linkstart').addClass('selected'); }
if (filename == 'edition.php') { $('#linkedition').addClass('selected'); }
if (filename == 'indices.php') { $('#linkindices').addClass('selected'); }
if (filename == 'handschriften.php') { $('#linkhandschriften').addClass('selected'); }

$('.selectHandschriften').change(function(){
	$('#scriptsSelection option:selected').val();
});

/* MISC (end) */


/* PRELOAD IMAGES */

/*
$.fn.preload = function() {
	this.each(function(){
		$('<img/>')[0].src = this;
	});
}

$(['img1.jpg','img2.jpg','img3.jpg']).preload();
*/

/* (end) PRELOAD IMAGES */


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
	document.title = 'Archaeo 18: Start';
});

$('#linkedition').click(function(){
	showDiv('#edition_page','#linkedition');
	EditionGui.gridLayout();
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
});

$('#linkindices').click(function(){
	showDiv('#indices_page','#linkindices');
	Indices.checkDisplay();
	location.hash = "?page=#indices_page&link=#linkindices";
	document.title = 'Archaeo 18: Indices';
});

$('#linkhandschriften').click(function(){
	showDiv('#manuscripts_page','#linkhandschriften');
	location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	document.title = 'Archaeo 18: Handischriften';
});

$('#linkstart2').click(function(){
	showDiv('#start_page','#linkstart');
	location.hash = "?page=#start_page&link=#linkstart";
	document.title = 'Archaeo 18: Start';
});

$('#linkedition2').click(function(){
	showDiv('#edition_page','#linkedition');
	EditionGui.gridLayout();
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
});
$('#linkedition3').click(function(){
	showDiv('#edition_page','#linkedition');
	EditionGui.gridLayout();
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
});
$('#linkedition3').click(function(){
	showDiv('#edition_page','#linkedition');
	EditionGui.gridLayout();
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
});

$('#linkindices2').click(function(){
	showDiv('#indices_page','#linkindices');
	Indices.checkDisplay();
	location.hash = "?page=#indices_page&link=#linkindices";
	document.title = 'Archaeo 18: Indices';
});

$('#linkhandschriften2').click(function(){
	showDiv('#manuscripts_page','#linkhandschriften');
	location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	document.title = 'Archaeo 18: Handschriften';
});

$('#linkhelp').click(function(){
	showDiv('#help_page','#linkhelp');
	location.hash = "?page=#help_page";
	document.title = 'Archaeo 18: Hilfe';
});

$('#linkterms').click(function(){
	showDiv('#terms_page','#linkhelp');
	location.hash = "?page=#terms_page";
	document.title = 'Archaeo 18: Editionsrichtlinien';
});

$('#linkimprint').click(function(){
	showDiv('#imprint_page','#linkimprint');
	location.hash = "?page=#imprint_page";
	document.title = 'Archaeo 18: Impressum';
});

$('#linkdatabases').click(function(e){
	showDiv('#databases_page','#linkdatabases',e);
	location.hash = "?page=#databases_page";
	document.title = 'Archaeo 18: Datenbanken und Repositorien';
});

$('#linkpeople').click(function(e){
	showDiv('#people_page','#linkpeople',e);
	location.hash = "?page=#people_page";
	document.title = 'Archaeo 18: Projekmitarbeiter';
});

window.onhashchange = function(){
	if( location.hash.indexOf('?') != -1 ){
		loadPage();
	}
};

EditionGui.initialize({
	configurationUrl: 'js/Archaeo18Config.js',
	maxTags: 20
});
