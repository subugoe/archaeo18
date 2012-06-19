var arrayIndex = function( array, obj ){
	if( Array.indexOf ){
		return array.indexOf(obj);
	}	
	for (var i = 0; i < array.length; i++ ){
      	if (array[i] == obj) {
			return i;
		}
     	}
     	return -1;
}

STILoader = {
		
	resolveUrlPrefix: function(file){
		var sources = document.getElementsByTagName("script");
		for( var i=0; i<sources.length; i++ ){
			var index = sources[i].src.indexOf(file);
			if( index != -1 ){
				return sources[i].src.substring(0,index);
			}
		}
	},
	
	load: function(){
		STILoader.startTime = new Date();
		STILoader.urlPrefix = STILoader.resolveUrlPrefix('js/build/loader/Loader.js');
		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix + 'js/build/loader/TimeplotLoader.js'}],STILoader.loadTimeplot);
	},
	
	loadTimeplot: function(){
		TimeplotLoader.load( STILoader.urlPrefix+'lib/', STILoader.loadScripts );
	},
	
	loadScripts : function() {

		SimileAjax.includeCssFile(document,STILoader.urlPrefix+'css/style.css');
		SimileAjax.includeCssFile(document,STILoader.urlPrefix+'lib/openlayers/theme/default/style.css');

		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix+'lib/slider/js/range.js' }]);
		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix+'lib/slider/js/slider.js' }]);
		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix+'lib/slider/js/timer.js' }]);
		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix+'js/core/' + 'timeplot-modify.js' }]);
		(new DynaJsLoader()).loadScripts([{ url: STILoader.urlPrefix+'js/core/' + 'ExtendedSimileTimeDate.js' }]);
		
		var olFiles = [
                       { 
                    	   url: STILoader.urlPrefix+'lib/' + 'openlayers/' + 'OpenLayers.js'
                       },
                       { 
                    	   url: STILoader.urlPrefix+'js/core/' + 'ModifiedZoomPanel.js',
                       }
	        ];
		(new DynaJsLoader()).loadScripts(olFiles);

		var stiFiles = [
		                { 
	                       url: STILoader.urlPrefix+'js/core/' + 'STIStatic.js',
	                       test: "STIStatic.getAbsoluteTop"
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'MapControl.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'FilterBar.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'PlacenameTags.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'MapGui.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'MapWidget.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'TimeGui.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'TimeWidget.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'TableGui.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'TableWidget.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'DataObject.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'DataSet.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'TimeDataSource.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'Binning.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'MapDataSource.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'Clustering.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'kruskal.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'FullscreenWindow.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'Dropdown.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'MapZoomSlider.js',
		                },
		                { 
		                   url: STILoader.urlPrefix+'js/core/' + 'Popup.js',
		                },
		                {
		                   url: STILoader.urlPrefix+'js/core/Publisher.js',
		                },
		                {
		                   url: STILoader.urlPrefix+'js/core/MapWrapper.js',
		                },
		                {
		                   url: STILoader.urlPrefix+'js/core/TimeWrapper.js',
		                },
		                {
		                   url: STILoader.urlPrefix+'js/core/TableWrapper.js',
		                }
		];
		(new DynaJsLoader()).loadScripts(stiFiles,STILoader.initSTI);
        
    },

    initSTI : function() {

       	STIStatic.configure(STILoader.urlPrefix);
	Publisher.Publish('StifReady','yeah',null);

    }   
}

STILoader.load();
