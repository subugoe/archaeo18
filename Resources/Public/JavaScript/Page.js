PageLoader.run();

EditionProperties.applySettings({
	"hyperlinkWindow": false,
	"documentEndpoint": "content/app/list-docs.xml",
	"textQuery": "content/app/content/DOC_ID.xml",
	"pageQuery": "content/app/xhtml-pages/DOC_ID-PAGE_ID.xhtml",
	"outlineQuery": "content/app/structure/DOC_ID.xml",
	//"searchQuery": "http://heyne-digital.tc.sub.uni-goettingen.de/satan/archaeo18/select?q=content%3AQUERY_ID&wt=xslt&indent=true&hl=true&hl.fl=content&hl.fragsize=0&tr=solrresponse.xsl",
	"searchQuery": "ropen/testdata/search/nymphe.xml",
	"facetsQuery": "content/app/facets.xml",
	"metadataQuery": "/exist/rest/db/archaeo18/queries/getText.xq?mode=header&format=xhtml&doc=DOC_ID",
	"facetTableQuery": "content/app/indices/FACET_ID.xhtml",
	"tagcloudQuery": "content/app/cloud/FACET_ID.xhtml",
	"mapQuery": "content/app/map/map.kml",
	"tagcloudPageQuery": "content/app/cloud/DOC_ID-PAGE_ID-FACET_ID.xml",
	"kmlQuery": "content/app/kml/DOC_ID-PAGE_ID.kml",
	"teiUri": "content/app/tei/DOC_ID.xml",
	"metsUri": "content/app/mets/DOC_ID.xml",
	"openDocumentsOnStart": true,
	"documentOnStart": "berlin-ms-germ-qrt-1666",
	"maxTags": 20
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

var KEYCODE_ESC = 27;
$('body').keyup(function(e) {
	if (e.keyCode === KEYCODE_ESC) {
		$('.easterEgg').toggle();
	}
});