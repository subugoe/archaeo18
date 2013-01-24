/* HEADER */

var headerState = $.cookie('header');
// console.log(headerState);

if (headerState == 'header-small') {
	$('html').toggleClass('header-small');
	$('.header-button').removeClass('header-button-close').addClass('header-button-open');
}

$('.header-button').click(function() {
	// console.log('header button clicked');
	if (headerState == 'header-small') {
		// console.log('make header big');
		$.cookie('header', '');
		$('html').toggleClass('header-small', '');
		$('.header-button').removeClass('header-button-open').addClass('header-button-close');
	} else {
		// console.log('make header small');
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
/*$('footer .wrap div:nth-child(4)').height(50);*/

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

$('#fullscreen').click(function(){
	$('#editionContainer').fullScreen(true);
});

/* MISC (end) */
