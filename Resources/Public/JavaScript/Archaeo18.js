requirejs.config({
					 shim: {
						 'EditionGui': {
							 //These script dependencies should be loaded before loading
							 //backbone.js
							 deps: [
								'../ropen/lib/GeoTemCo/geotemco-min',
								'../ropen/lib/jQuery/jquery-1.5.1',
								'../ropen/lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom',
								'../ropen/lib/dynatree/src/jquery.dynatree',
								'../ropen/lib/lazyloader/jquery.lazyloader',
								'../ropen/lib/fullscreen/fullscreen',
								'../ropen/lib/jsonlib/jsonlib',
								'../ropen/lib/jqcloud/jqcloud-1.0.0',
								'../ropen/js/Config/EditionProperties',
								'../ropen/js/Config/EditionTooltips',
								'../ropen/js/System/DocumentServerConnection',
								'../ropen/js/System/Util',
								'../ropen/js/System/BrowserDetect',
								'../ropen/js/Processors/TEIProcessor',
								'../ropen/js/Processors/XHTMLProcessor',
								'../ropen/js/Processors/LinkProcessor',
								'../ropen/js/Gui/Pagination',
								'../ropen/js/Gui/FacetSelector',
								'../ropen/js/Document/Document',
								'../ropen/js/Document/Views/Text',
								'../ropen/js/Document/Views/Images',
								'../ropen/js/Document/Views/Pages',
								'../ropen/js/Document/Views/Outline',
								'../ropen/js/Document/Views/TEI',
								'../ropen/js/Document/Views/Thumbnails',
								'../ropen/js/Document/Views/Places',
								'../ropen/js/Document/Views/Tags',
								'../ropen/js/Gui/FrameWindow',
								'../ropen/js/Gui/Folder',
								'../ropen/js/Gui/HyperlinkWindow',
								'../ropen/js/Gui/Browser',
								'../ropen/js/Gui/DocumentDialog',
								'../ropen/js/Gui/OverlayWindow',
								'../ropen/js/Gui/Tooltip',
								'../ropen/js/EditionGui'
							 ]
						 }
					 }
				 });