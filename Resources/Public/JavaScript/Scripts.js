/*
 * scripts page implementation
 */
var Scripts = new function() {

	this.initialized = false;

	/*
	 * initialize scripts page; load documents
	 */
	this.initialize = function() {
		// templating
		var source = $("#scriptsTemplate").html();

		var template = Handlebars.compile(source);

		var data = [];
		data['scriptSelectionHeader'] =  Util.getString('scriptSelection');

		data['scripts'] = [];

		this.initialized = true;

		var gui = this;

		var loadDocs = function() {

			if (Util.docsLoaded == 1) {
				for (var i = 0; i < Util.documents.length; i++) {
					var script = [];
					script['id'] = Util.documents[i].title;
					script['title'] = Util.documents[i].name;

					data['scripts'].push(script);
				}

				// put data into template
				$("#scriptsSelection").html(
						template(data)
				);

				// listener for clicks on item
				$(".selectHandschriften li").each(function() {
					$(this).click(function() {
						if ($(this).attr('id') != '') {
							$(".scriptList a").each(function() {
								$(this)
										.removeClass("selected")
										.removeClass("icon-chevron-down")
										.addClass("icon-chevron-right");
							})

							$("a", this)
									.addClass('selected')
									.removeClass("icon-chevron-right")
									.addClass("icon-chevron-down");

							gui.showDocument($(this).attr('id'));
						}
					})
				});
			}
			else {
				if (Util.docsLoaded == -1) {
					Util.loadDocuments();
				}
				setTimeout(function() {
					loadDocs();
				}, 100);
			}
		}
		loadDocs();
		this.scriptContainer = $("#scriptsContainer");
	};


	/*
	 * show document with given <title>
	 */
	this.showDocument = function(title) {

		// templating
		var source = $("#scriptsContainerTemplate").html();
		var template = Handlebars.compile(source);

		var doc = Util.getDoc(title);
		var gui = this;
		$(this.scriptContainer).empty();
		$.ajax({
			url: EditionProperties.metadataQuery.replace('DOC_ID', title),
			dataType: 'html',
			success: function(xhtml) {
				var data = [];

				data['scriptSelectedHeader'] = Util.getString('handwriting');
				data['title'] = title;
				data['width'] = ScriptsProps.hwImageWidth;
				data['height'] = ScriptsProps.hwImageHeight;
				data['src'] = doc.preview;
				data['content'] = xhtml

				// put data into template
				$("#scriptsContainer").html(
					template(data)
				);

				// hide english labels
				$('#scriptsContainer span').each(function() {
					var lang = Util.getAttribute(this, 'xml:lang');
					if (Util.language != lang && this.className !== 'tei:date') {
						$(this).addClass('visuallyhidden');
					}
				});
			}
		});
	};
};

ScriptsProps = {
	// default size if manuscripts page image 
	hwImageHeight: 328,
	hwImageWidth: 359
};