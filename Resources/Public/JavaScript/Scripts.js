/*
 * scripts page implementation
 */
var Scripts = new function() {

	this.initialized = false;

	/*
	 * initialize scripts page; load documents
	 */
	this.initialize = function() {
		$('.scriptsContainer').hide();

		this.initialized = true;
		// listener for clicks on item
		$(".selectHandschriften li").click(function() {
			var scriptId = $(this).attr('id')

			console.log(scriptId);
			if (scriptId != '') {
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

		$('.selectHandschriften li:first').click();

	};
};

ScriptsProps = {
	// default size if manuscripts page image 
	hwImageHeight: 328,
	hwImageWidth: 359
};