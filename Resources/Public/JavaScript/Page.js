PageLoader.run();
/* MISC */

$('.selectHandschriften').change(function() {
	$('#scriptsSelection option:selected').val();
});

/* MISC (end) */

EditionProperties.applySettings({
									configurationUrl: 'Resources/Public/JavaScript/Archaeo18Config.js',
									maxTags: 20
								});

var loadTwoColumns = function(div) {
	var mainContentContainer = $(div + ' .maincontent .topics');
	var subNavigationContainer = div + ' .subnav';

	$(subNavigationContainer + ' a').removeClass('selected');

	// listener for clicks on item
	$(subNavigationContainer + ' li').click(function() {
		var scriptId = $('a', this).attr('id')
		if (scriptId !== '') {
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
			};

			var pageUrl = 'content/' + idToMarkdown(scriptId) + '.html';

			$.ajax({
				url: pageUrl
			}).done(function(html) {
				mainContentContainer[0].innerHTML = html;
			});
			return false;
		}
	});

	$(subNavigationContainer + ' li:first').click();
};

var loadIndices = function() {
	if (!Indices.initialized) {
		Indices.initialize();
	}
	Indices.checkDisplay();
};

var loadScripts = function() {
	if (!Scripts.initialized) {
		Scripts.initialize();
	}
};

var addGeoTemCo = function() {
	if (typeof(GeoTemConfig) === 'undefined') {
		var css, js;
		css = '<link rel="stylesheet" href="ropen/Resources/Public/JavaScript/Libraries/GeoTemCo/css/geotemco.css" type="text/css" />';
		js = '<script src="ropen/Resources/Public/JavaScript/Libraries/GeoTemCo/geotemco-min.js"></script>';
		$('head').append(css + js);
	}
}

var loadPage = function() {
	if (window.location.href.indexOf('?params') !== -1) {
		addGeoTemCo();
		ContentLoader.showDiv('#edition_page', '#linkedition');
		EditionLoader.load();
	} else
		if (window.location.href.indexOf('?page=') !== -1) {
			var data = window.location.href.split('?page=')[1];

			// get path to be loaded from the "CMS"
			var pagePath = data.split('_page')[0].replace('#', '');

			var page = data, link;
			if (data.indexOf('&link=') !== -1) {
				var data2 = data.split('&link=');
				page = data2[0];
				link = data2[1];
			}
			ContentLoader.showDiv(page, link);
			if (pagePath !== 'edition' && pagePath !== 'indices' && pagePath !== 'manuscripts' && pagePath !== 'terms') {
				ContentLoader.load(pagePath);
			}

			if (page.indexOf('edition') !== -1) {
				addGeoTemCo();
				EditionLoader.load();
			}
			else
				if (page.indexOf('indices') !== -1) {
					addGeoTemCo();
					loadIndices();
				}
				else
					if (page.indexOf('manuscripts') !== -1) {
						loadScripts();
					} else
						if (page.indexOf('start') !== -1) {
							ContentLoader.showDiv('#start_page', '#linkstart');
							ContentLoader.load('start', 'html');
						} else
							if (page.indexOf('help') !== -1) {
								loadTwoColumns('#help_page');
							} else
								if (page.indexOf('terms') !== -1) {
									loadTwoColumns('#terms_page');
								}
		} else {
			ContentLoader.showDiv('#start_page', '#linkstart');
			ContentLoader.load('start');
		}
};
loadPage();


window.onhashchange = function() {
	if (location.hash.indexOf('?') !== -1) {
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

var KEYCODE_ESC = 27;
$('body').keyup(function(e) {
	if (e.keyCode == KEYCODE_ESC) {
		$('.easterEgg').toggle();
	}
});