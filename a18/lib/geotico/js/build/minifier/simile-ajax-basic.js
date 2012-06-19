SimileAjax_urlPrefix = STIMinifier_urlPrefix + 'lib/simile/ajax/';

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
}
