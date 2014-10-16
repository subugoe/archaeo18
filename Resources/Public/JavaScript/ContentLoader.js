var ContentLoader = (function() {
	"use strict";
	var content = {};

	var pageTitlePrefix = 'Archaeo 18: ';

	var pageConcordance = [
		{
			linkId: '#linkstart',
			page: '#start_page',
			title: 'Start'
		},
		{
			linkId: '#linkedition',
			page: '#edition_page',
			title: 'Edition',
			exec: ['addGeoTemCo', 'loadEdition']
		},
		{
			linkId: '#linkindices',
			page: '#indices_page',
			title: 'Indices',
			exec: ['addGeoTemCo', 'loadIndices']
		},
		{
			linkId: '#linkindices1',
			page: '#indices_page',
			title: 'Indices',
			exec: ['addGeoTemCo', 'loadIndices']
		},
		{
			linkId: '#linkhandschriften',
			page: '#manuscripts_page',
			title: 'Handschriften',
			exec: ['loadScripts']
		},
		{
			linkId: '#linkhandschriften2',
			page: '#manuscripts_page',
			title: 'Handschriften',
			exec: ['loadScripts']
		},
		{
			linkId: '#linkstart2',
			page: '#start_page',
			title: 'Handschriften',
			exec: ['Start']
		},
		{
			linkId: '#linkedition2',
			page: '#edition_page',
			title: 'Edition',
			exec: ['loadEdition']
		},
		{
			linkId: '#linkedition3',
			page: '#edition_page',
			title: 'Edition',
			exec: ['loadEdition']
		},
		{
			linkId: '#linkhelp',
			page: '#help_page',
			title: 'Hilfe',
			exec: ['loadTwoColumns']
		},
		{
			linkId: '#linkterms',
			page: '#terms_page',
			title: 'Editionsrichtlinien',
			exec: ['loadTwoColumns']
		},
		{
			linkId: '#linkimprint',
			page: '#imprint_page',
			title: 'Impressum'
		},
		{
			linkId: '#linkdatabases',
			page: '#databases_page',
			title: 'Datenbanken und Repositorien'
		},
		{
			linkId: '#linkacknowledgment',
			page: '#acknowledgment_page',
			title: 'Danksagung'
		},
		{
			linkId: '#linkpeople',
			page: '#people_page',
			title: 'Projekmitarbeiter'
		}
	];

	$(pageConcordance).each(function(i, page){
		$(page.linkId).bind('click', function() {
			content.showDiv(page.page, encodeURIComponent(page.linkId));
			$('html,body').animate({scrollTop: 0}, 0);
			location.hash = '?page=' + page.page + '&link=' + page.linkId;
			console.log(location.hash);
			document.title = pageTitlePrefix + page.title;
			if (typeof page.exec === 'object') {
				for (var exec in page.exec) {
					var functionName = page.exec[exec];
					var fn = window[functionName];
					if (typeof fn === "function") {
						if (functionName === 'loadTowColumns') {
							fn.apply(null, page.page);
						} else {
							fn();
						}
					}
				}
			}
		});
	});

	/**
	 * Show a section of the page
	 * @param div
	 * @param link
	 */
	content.showDiv = function(div, link) {
		$(pageConcordance).each(function(i, page){
			$(page.page).hide();
			$(page.linkId).removeClass('selected');
		});

		if (typeof link !== 'undefined') {
			$(decodeURIComponent(link)).addClass('selected');
		}
		$(div).css('display', 'block');
	};

	/**
	 * Load Content asynchronous
	 *
	 * @param page
	 */
	content.load = function(page) {
		var suffix = arguments[1] === 'md' ? 'md' : 'html';
		var pageUrl = 'content/' + page + '/index.' + suffix;

		var content = this;

		content.container = function() {
			return '#' + page + '_page';
		};

		$.ajax({
			url: pageUrl
		}).done(function(html) {
			var container = $(content.container() + ' .wrap');

			var containerContent;

			if (suffix === 'md') {
				containerContent = markdown.toHTML(html);
			} else {
				container.html(html);
			}

			$('a[href^="http://"]').attr('target', '_blank');
		});
	};

	return content;
})()