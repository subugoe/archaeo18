/* HEADER */

$('.header-button').click(function() {
	if (localStorage.getItem('headerState') === 'small') {
		$('html').removeClass('header-small').addClass('header-large');
		$('.header-button').removeClass('icon-chevron-up').addClass('icon-chevron-down');
		localStorage.setItem('headerState', 'large');
	} else {
		$('html').removeClass('header-large').addClass('header-small');
		$('.header-button').removeClass('icon-chevron-down').addClass('icon-chevron-up');
		localStorage.setItem('headerState', 'small');
	}
	return false;
});

var setHeaderSize = function() {

	var headerState = localStorage.getItem('headerState');

	var headerButton = function() {
		if (headerState === 'small') {
			$('.header-button').removeClass('icon-chevron-down').addClass('icon-chevron-up');
		} else {
			$('.header-button').removeClass('icon-chevron-up').addClass('icon-chevron-down');
		}
	}

	$('html').addClass('header-' + headerState);
	headerButton();
}

setHeaderSize();

/* HEADER (end) */

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

var loadTwoColumns = function(div) {
	var mainContentContainer = $(div + ' .maincontent .topics');
	var subNavigationContainer = div + ' .subnav';

	$(subNavigationContainer + ' a').removeClass('selected');

	// listener for clicks on item
	$(subNavigationContainer + ' li').click(function() {
		var scriptId = $('a', this).attr('id')
		if (scriptId != '') {
			$(subNavigationContainer + ' a').each(function() {
				$(this).removeClass("selected");
			});

			$('a', this).addClass('selected');

			var idToMarkdown = function(id) {
				var pathParts = id.split('-');
				var firstPartOfPath = pathParts[0];
				pathParts.splice(0, 1);

				var fileName = firstPartOfPath + '/' + pathParts.join('-');
				return fileName;
			}

			var pageUrl = 'content/' + idToMarkdown(scriptId) + '.md';

			$.ajax({
					   url: pageUrl
				   }).done(function(html) {
							   mainContentContainer.html(markdown.toHTML(html), 'md_tree');
						   });
			return false;
		}
	});

	$(subNavigationContainer + ' li:first').click();
}

var loadContent = function(page) {
	var pageUrl = 'content/' + page + '/index.md';

	var content = this;

	content.container = function() {
		return '#' + page + '_page';
	}

	$.ajax({
		url: pageUrl
		})
			.done(function(html) {
					  var container = $(content.container() + ' .wrap');
					  container.html(markdown.toHTML(html));
				  });
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

var addGeoTemCo = function() {
	if (typeof(GeoTemConfig) === 'undefined') {
		var css, js;
		css = '<link rel="stylesheet" href="ropen/Resources/Public/JavaScript/Libraries/GeoTemCo/css/geotemco.css" type="text/css" />';
		js = '<script src="ropen/Resources/Public/JavaScript/Libraries/GeoTemCo/geotemco-min.js"></script>';
		$('head').append(css + js);
	}
}

var loadPage = function() {
	if (window.location.href.indexOf('?params') != -1) {
		showDiv('#edition_page', '#linkedition');
		loadEdition();
	} else
		if (window.location.href.indexOf('?page=') != -1) {
			var data = window.location.href.split('?page=')[1];

			// get path to be loaded from the "CMS"
			var pagePath = data.split('_page')[0].replace('#', '');

			var page = data, link;
			if (data.indexOf('&link=') != -1) {
				var data2 = data.split('&link=');
				page = data2[0];
				link = data2[1];
			}
			showDiv(page, link);
			if (pagePath !== 'edition' && pagePath !== 'indices' && pagePath !== 'manuscripts' && pagePath !== 'terms') {
				loadContent(pagePath);
			}

			if (page.indexOf('edition') != -1) {
				addGeoTemCo();
				loadEdition();
			}
			else
				if (page.indexOf('indices') != -1) {
					addGeoTemCo();
					loadIndices();
				}
				else
					if (page.indexOf('manuscripts') != -1) {
						loadScripts();
					} else
						if (page.indexOf('start') !== -1) {
							showDiv('#start_page', '#linkstart');
							loadContent('start');
						} else
							if (page.indexOf('help') !== -1) {
								loadTwoColumns('#help_page');
							} else
								if (page.indexOf('terms') !== -1) {
									loadTwoColumns('#terms_page');
								}
		} else {
			showDiv('#start_page', '#linkstart');
			loadContent('start');
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
	addGeoTemCo();
	document.title = 'Archaeo 18: Edition';
	loadEdition();
});

$('#linkindices').click(function() {
	showDiv('#indices_page', '#linkindices');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#indices_page&link=#linkindices";
	addGeoTemCo();
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
	loadTwoColumns(divToShow);
});

$('#linkterms').click(function() {
	showDiv('#terms_page', '#linkhelp');
	$('html,body').animate({scrollTop: 0}, 0);
	location.hash = "?page=#terms_page";
	document.title = 'Archaeo 18: Editionsrichtlinien';
	loadTwoColumns('#terms_page');
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