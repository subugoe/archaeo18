/**
 *  DynaJsLoader.js
 *
 *  @author     Stefan Jänicke <stjaenicke@informatik.uni-leipzig.de>
 *  @created    2011-09-07 18:46 GMT +1
 *  @version    2011-09-07 18:46 GMT +1
 */

function DynaJsLoader(){
    
	this.checkInterval = 20;
	this.loadAttempts = 2000;
    
    this.loadScripts = function( scripts, callback ) {
        
    	if( scripts.length > 0 ){
        	this.scriptStack = scripts;
        	this.scriptIndex = 0;
        	this.loadScript(callback);
    	}
    	        
    };
    
    this.loadScript = function( callback ) {

    	var loader = this;
    	if( this.scriptIndex < this.scriptStack.length ){

    	    var scriptEmbedded = false, scriptLoaded = false, iter = 0;
    		var scriptData = this.scriptStack[this.scriptIndex];
    		this.scriptIndex++;
    		var testFunction = scriptData.test;
        	var test = function() {
        		scriptEmbedded = true;
        		if (!testFunction || typeof(eval(testFunction)) === 'function') {
        			scriptLoaded = true;
        		}
        		else {
        			setTimeout(function () {
        				test();
        			}), loader.checkInterval
        		}
        	}
        	
        	var head = document.getElementsByTagName('head')[0];
        	var script = document.createElement('script');
        	script.type = 'text/javascript';
        	script.src = scriptData.url;
        	
        	script.onload = test;
        	script.onreadystatechange = function() {
    	    	if (this.readyState == 'complete') {
    	    		test();
    	    	}
        	}

        	head.appendChild(script);

        	var checkStatus = function(){
        		if( scriptEmbedded && scriptLoaded ){
        			loader.loadScript(callback);
        			if(typeof console != 'undefined'){
        			    console.log(scriptData.url +" loaded in "+(iter*loader.checkInterval)+" ms");
        			}
        		}
        		else {
        			iter++;
        			if( iter > loader.loadAttempts ){
        			    if(typeof console != 'undefined'){
        			        console.log("MapTimeView not loaded: Not able to load "+scriptData.url+"!");
        			        Publisher.Publish('StifReady',null);
        			    }
        				return;
        			}
        			setTimeout(function () {
        				checkStatus();
        			}), loader.checkInterval
        		}
        	}
        	checkStatus();
        	
    	}
    	else if( callback ){
       		callback();
       	}
    	        
    };
        
};