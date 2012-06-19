TimeplotLoader = {		
		
    load : function( urlPrefix, callback ) {

    	JQuery_urlPrefix = urlPrefix+'jquery/';
    	SimileAjax_urlPrefix = urlPrefix+'simile/ajax/';
    	Timeline_urlPrefix = urlPrefix+'simile/timeline/';
    	Timeplot_urlPrefix = urlPrefix+'simile/timeplot/';
    	TimeplotLoader.callback = callback;
        
        if (typeof jQuery != 'undefined') {  
        	TimeplotLoader.loadSimileAjax();
        }
        else {
     		(new DynaJsLoader()).loadScripts([{ url: JQuery_urlPrefix + 'jquery-1.4.4.min.js' }],TimeplotLoader.loadSimileAjax);
        }    
        
    },
    
    loadSimileAjax : function() {
            
		if (typeof window.SimileAjax == "undefined") {
		    window.SimileAjax = {
		        loadingScriptsCount:    0,
		        error:                  null,
		        params:                 { bundle:"true" }
		    };		    
		    SimileAjax.Platform = new Object();		        
		    SimileAjax.includeCssFile = function(doc, url) {
		        var link = doc.createElement("link");
		        link.setAttribute("rel", "stylesheet");
		        link.setAttribute("type", "text/css");
		        link.setAttribute("href", url);
		        doc.getElementsByTagName("head")[0].appendChild(link);
		    };		    
	        SimileAjax.urlPrefix = SimileAjax_urlPrefix;
	        var jsFiles = [
	                       { 
	                    	   url: SimileAjax.urlPrefix + "simile-ajax-bundle.js",
	                    	   test: "SimileAjax.XmlHttp._forceXML"
	                       }
	        ];
	        (new DynaJsLoader()).loadScripts(jsFiles,TimeplotLoader.loadTimeline);	        
	        SimileAjax.includeCssFile(document, SimileAjax.urlPrefix + "styles/" + "graphics.css");
		}
		else {
			TimeplotLoader.loadTimeline();
		}
		
    },    
    
    loadTimeline : function() {
		    
		SimileAjax.History.enabled = false;

    	if (typeof window.Timeline == "undefined") {
	        window.Timeline = new Object();
        	Timeline.urlPrefix = Timeline_urlPrefix;	
	        window.Timeline.DateTime = window.SimileAjax.DateTime; // for backward compatibility
	        var jsFiles = [
	                       { 
	                    	   url: Timeline.urlPrefix + "timeline-bundle.js",
	                    	   test: "Timeline.NativeDateUnit.change"
	                       },
	                       { 
	                    	   url: Timeline.urlPrefix + "scripts/l10n/en/" + "timeline.js"
	                       },
	                       { 
	                    	   url: Timeline.urlPrefix + "scripts/l10n/en/" + "labellers.js"
	                       }
	        ];
	        (new DynaJsLoader()).loadScripts(jsFiles,TimeplotLoader.loadTimeplot);	        
            SimileAjax.includeCssFile(document, Timeline.urlPrefix + "timeline-bundle.css");
        }
        else {
        	TimeplotLoader.loadTimeplot();
        }

    },
    
    loadTimeplot : function() {
        
        if (typeof window.Timeplot == "undefined") {
            	window.Timeplot = {
                    params:     { bundle: true, autoCreate: true },
                    namespace:  "http://simile.mit.edu/2007/06/timeplot#",
                    importers:  {}
                };            
            	Timeplot.urlPrefix = Timeplot_urlPrefix;
    	        var jsFiles = [];    	        
                var canvas = document.createElement("canvas");
                if (!canvas.getContext) {
                	jsFiles.push({ 
                 	   url: Timeplot.urlPrefix + "lib/excanvas.js",
                	   test: canvas.getContext
                   });
                }
                jsFiles.push({ 
             	   url: Timeplot.urlPrefix + "timeplot-bundle.js",
            	   test: "Timeplot.Processor.prototype.removeListener"
                });
                (new DynaJsLoader()).loadScripts(jsFiles,TimeplotLoader.callback);
                SimileAjax.includeCssFile(document, Timeplot.urlPrefix + "timeplot-bundle.css");
        }
        else if( callback ){
        	callback();
        }
        
    }
    
};
