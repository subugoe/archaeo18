var EditionLoader = (function() {

	"use strict";
	var edition = {};

	edition.load = function() {
		if (!EditionGui.initialized) {
			EditionGui.initialize();
		}
		EditionGui.gridLayout();

		var loadFirstDocument = function(data) {
			var doc = new Document(data.title, data.name, data.nameShort, data.preview, data.pages, true);
			doc.imagePath = data.imagePath.replace('REPLACEME', data.title);
			var images = data.images;
			doc.images = images;
			var types = ['text', 'images'];
			for (var i = 0; i < types.length; i++) {
				EditionGui.openDocument(false, doc, 1, types[i], false, '', i);
			}

		};

		var loadDoc = function() {
			var callStorage = 0;
			Util.loadDocuments(function(data) {
				if (callStorage === 0) {
					callStorage++;
					loadFirstDocument(data);
				}
			});
		};

		loadDoc();
	};

	return edition;

})();