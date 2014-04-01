var PageLoader = (function(){
	"use strict";
	var page = {};

	var clearStorage = function() {
		sessionStorage.clear();
	};

	var resizeHeader = function() {

		var headerState;

		$('.header-button').bind('click', function() {
			if (localStorage.getItem('headerState') === 'small') {
				headerState = 'large';
				$('html').removeClass('header-small').addClass('header-' + headerState);
				$('.header-button').removeClass('icon-chevron-up').addClass('icon-chevron-down');
				$('html').addClass('header-' + headerState);

			} else {
				headerState = 'small';
				$('html').removeClass('header-large').addClass('header-small');
				$('.header-button').removeClass('icon-chevron-down').addClass('icon-chevron-up');
				$('html').addClass('header-' + headerState);
			}
			localStorage.setItem('headerState', headerState);
		});
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

	page.run = function() {
		clearStorage();
		resizeHeader();
	};

	return page;

})()