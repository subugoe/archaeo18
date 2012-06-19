Timeline_urlPrefix = STIMinifier_urlPrefix + 'lib/simile/timeline/';

SimileAjax.History.enabled = false;

if (typeof window.Timeline == "undefined") {
        window.Timeline = new Object();
     	Timeline.urlPrefix = Timeline_urlPrefix;	
        window.Timeline.DateTime = window.SimileAjax.DateTime; // for backward compatibility
}
