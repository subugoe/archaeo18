/*
 * scripts page implementation
 */
var Scripts = (function() {
	"use strict";
	var script = {};

	script.properties = {
		// default size if manuscripts page image
		hwImageHeight: 328,
		hwImageWidth: 359
	};

	script.initialized = false;

	/*
	 * initialize scripts page; load documents
	 */
	script.initialize = function() {
		$('.scriptsContainer').hide();

		script.initialized = true;
		// listener for clicks on item
		$(".selectHandschriften li").click(function() {
			var scriptId = $(this).attr('id');

			if (scriptId !== '') {
				$(".scriptList a").each(function() {
					$(this).removeClass("selected");
				});

				$("a", this).addClass('selected');
				$('.scriptsContainer').hide();

				var pageUrl = 'content/manuscripts/' + scriptId + '.html';

				$.ajax({
						url: pageUrl
				}).done(function(html) {
					$(".scriptsWrapper").html(html);
				});
				return false;
			}
		});
		$('.selectHandschriften').change(function() {
			$('#scriptsSelection option:selected').val();
		});
		$('.selectHandschriften li:first').click();

	};
	return script;
})();
