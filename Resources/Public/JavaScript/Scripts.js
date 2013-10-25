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

		var firstActive = function() {
			$('.scriptsContainer:first').show();
			$(".scriptList a:first").addClass('selected');
		}

		firstActive();

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

				$(".scriptsWrapper").append($('.' + scriptId).show());
				return false;
			}
		});

	};
};

ScriptsProps = {
	// default size if manuscripts page image 
	hwImageHeight: 328,
	hwImageWidth: 359
};