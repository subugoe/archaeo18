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
console.log(filename);
if (filename == 'start.php') { $('#linkstart').addClass('selected'); }
if (filename == 'edition.php') { $('#linkedition').addClass('selected'); }
if (filename == 'indices.php') { $('#linkindices').addClass('selected'); }
if (filename == 'handschriften.php') { $('#linkhandschriften').addClass('selected'); }

$('.selectHandschriften').change(function(){
	var jumpHere = $('option:selected').val();
	window.location.hash = '#' + jumpHere;
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