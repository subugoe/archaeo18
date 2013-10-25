/* HEADER */

var headerState = $.cookie('header');
if ($.cookie('header') == 'header-small') {
	$('html').toggleClass('header-small');
	$('.header-button').removeClass('icon-chevron-up').addClass('icon-chevron-down');
}
$('.header-button').click(function() {
	if ($.cookie('header') == 'header-small') {
		$.cookie('header', '');
		$('html').toggleClass('header-small', '');
		$('.header-button').removeClass('icon-chevron-down').addClass('icon-chevron-up');
	} else {
		$.cookie('header', 'header-small');
		$('html').toggleClass('header-small');
		$('.header-button').removeClass('icon-chevron-up').addClass('icon-chevron-down');
	}
});

/* HEADER (end) */



/* SET FOOTER DIV HEIGHT */

$('footer .wrap div:first-child').height(215);
$('footer .wrap div:nth-child(2)').height(126);
$('footer .wrap div:nth-child(3)').height(106);

/* SET FOOTER DIV HEIGHT (end) */

/* MISC */

$('.selectHandschriften').change(function() {
	$('#scriptsSelection option:selected').val();
});

/* MISC (end) */

EditionProperties.applySettings({
									configurationUrl: 'Resources/Public/JavaScript/Archaeo18Config.js',
									maxTags: 20
								});

var showDiv = function(div, link) {
	$('#start_page').css('display', 'none');
	$('#edition_page').css('display', 'none');
	$('#indices_page').css('display', 'none');
	$('#manuscripts_page').css('display', 'none');
	$('#help_page').css('display', 'none');
	$('#terms_page').css('display', 'none');
	$('#databases_page').css('display', 'none');
	$('#acknowledgment_page').css('display', 'none');
	$('#people_page').css('display', 'none');
	$('#imprint_page').css('display', 'none');
	$('#linkstart').removeClass('selected');
	$('#linkedition').removeClass('selected');
	$('#linkindices').removeClass('selected');
	$('#linkhandschriften').removeClass('selected');
	if (typeof link != 'undefined') {
		$(link).addClass('selected');
	}
	$(div).css('display', 'block');
}

var loadIndices = function() {
	if (!Indices.initialized) {
		Indices.initialize();
	}
	Indices.checkDisplay();
}

var loadScripts = function() {
	if (!Scripts.initialized) {
		Scripts.initialize();
	}
}

var loadEdition = function() {
	if (!EditionGui.initialized) {
		EditionGui.initialize();
	}
	EditionGui.gridLayout();
}

var loadPage = function() {
	if (window.location.href.indexOf('?params') != -1) {
		showDiv('#edition_page', '#linkedition');
		loadEdition();
	} else
		if (window.location.href.indexOf('?page=') != -1) {
			var data = window.location.href.split('?page=')[1];
			var page = data, link;
			if (data.indexOf('&link=') != -1) {
				var data2 = data.split('&link=');
				page = data2[0];
				link = data2[1];
			}
			showDiv(page, link);
			if (page.indexOf('edition') != -1) {
				loadEdition();
			}
			else
				if (page.indexOf('indices') != -1) {
					loadIndices();
				}
				else
					if (page.indexOf('manuscripts') != -1) {
						loadScripts();
					}
		} else {
			showDiv('#start_page', '#linkstart');
		}
}
loadPage();

$('#linkstart').click(function() {
	showDiv('#start_page', '#linkstart');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#start_page&link=#linkstart";
	document.title = 'Archaeo 18: Start';
});

$('#linkedition').click(function() {
	showDiv('#edition_page', '#linkedition');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
	loadEdition();
});

$('#linkindices').click(function() {
	showDiv('#indices_page', '#linkindices');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#indices_page&link=#linkindices";
	document.title = 'Archaeo 18: Indices';
	loadIndices();
});

$('#linkhandschriften').click(function() {
	showDiv('#manuscripts_page', '#linkhandschriften');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	document.title = 'Archaeo 18: Handschriften';
	loadScripts();
});

$('#linkstart2').click(function() {
	showDiv('#start_page', '#linkstart');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#start_page&link=#linkstart";
	document.title = 'Archaeo 18: Start';
});

$('#linkedition2').click(function() {
	showDiv('#edition_page', '#linkedition');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
	loadEdition();
});

$('#linkedition3').click(function() {
	showDiv('#edition_page', '#linkedition');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#edition_page&link=#linkedition";
	document.title = 'Archaeo 18: Edition';
	loadEdition();
});

$('#linkindices2').click(function() {
	showDiv('#indices_page', '#linkindices');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#indices_page&link=#linkindices";
	document.title = 'Archaeo 18: Indices';
	loadIndices();
});

$('#linkhandschriften2').click(function() {
	showDiv('#manuscripts_page', '#linkhandschriften');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
	document.title = 'Archaeo 18: Handschriften';
	loadScripts();
});

$('#linkhelp').click(function() {
	var divToShow = '#help_page';
	showDiv(divToShow, '#linkhelp');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#help_page";
	document.title = 'Archaeo 18: Hilfe';
	initializeHelpNavigation(divToShow);
});

$('#linkterms').click(function() {
	showDiv('#terms_page', '#linkhelp');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#terms_page";
	document.title = 'Archaeo 18: Editionsrichtlinien';
});

$('#linkimprint').click(function() {
	showDiv('#imprint_page', '#linkimprint');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#imprint_page";
	document.title = 'Archaeo 18: Impressum';
});

$('#linkdatabases').click(function(e) {
	showDiv('#databases_page', '#linkdatabases', e);
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#databases_page";
	document.title = 'Archaeo 18: Datenbanken und Repositorien';
});

$('#linkacknowledgment').click(function(e) {
	showDiv('#acknowledgment_page', '#linkacknowledgment', e);
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#acknowledgment_page";
	document.title = 'Archaeo 18: Danksagung';
});

$('#linkpeople').click(function(e) {
	showDiv('#people_page', '#linkpeople', e);
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#people_page";
	document.title = 'Archaeo 18: Projekmitarbeiter';
});

window.onhashchange = function() {
	if (location.hash.indexOf('?') != -1) {
		loadPage();
	}
};

var footerWidth = $('#logoPanel').width();
$(window).resize(function() {
	var w = Math.max($(window).width(), $('#editionContainer').width());
	if (footerWidth > w) {
		$('footer').css('width', footerWidth + 'px');
	}
	else {
		$('footer').css('width', w + 'px');
	}
});


// Navigation with side bar
var initializeHelpNavigation = function(div) {

	var mainContentContainer = div + ' .maincontent .helptopics';
	var subNavigationContainer = div + ' .subnav';

	$('.helptopic').hide();

	var firstActive = function() {
		$('.helptopic:first').show();
		$(subNavigationContainer + ' a:first').addClass('selected');
	}

	firstActive();

	// listener for clicks on item
	$(subNavigationContainer + ' li').click(function() {
		var scriptId = $('a', this).attr('id')

		console.log(scriptId);
		if (scriptId != '') {
			$(subNavigationContainer + ' a').each(function() {
				$(this).removeClass("selected");
			});

			$('a', this).addClass('selected');
			$('.helptopic').hide();
			$(mainContentContainer).append($('.' + scriptId).show());
			return false;
		}
	});

};