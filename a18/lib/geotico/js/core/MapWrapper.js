/**
   data should not be retrieved through the space wrapper
   perform the data processing step in the top-level environment
   then, f.i., the table or timeplot widget can be filled with the same objects
*/
function MapWrapper(){

	this.initialize = function(div,index,title){
		this.map = new MapWidget(this,div,index,title);
	};

    var wrapper = this;

    Publisher.Subscribe('highlight',this,function(data){
        if( typeof wrapper.map != 'undefined' ){
             wrapper.highlight(data);
        }
    });

    Publisher.Subscribe('selection',this,function(data){
        if( typeof wrapper.map != 'undefined' ){
             wrapper.select(data);
        }	
    });

    Publisher.Subscribe('filter',this,function(data){
	if( typeof wrapper.map != 'undefined' ){
		wrapper.filter(data);
	}
    });

    Publisher.Subscribe('rise',this,function(id){
        if( typeof wrapper.map != 'undefined' ){
             wrapper.rise(id);
        }
    });

    this.display = function(data,zoom) {
    	if ( data instanceof Array ) {
	    	this.map.initMap(data,zoom);
    	}
    };

    this.triggerRefining = function(mapObjects) {
        if (mapObjects && mapObjects.length > 0) {
	    Publisher.Publish('filter',mapObjects,null);
        }
    };

    this.triggerSelection = function(mapObjects) {
	Publisher.Publish('selection',mapObjects,this);
    };

    this.triggerHighlight = function(mapObjects) {
	Publisher.Publish('highlight',mapObjects,this);
    };

    this.highlight = function(data) {
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
            this.map.highlightChanged(data);
        }
        else {
            this.map.highlightChanged([]);
        }
    };

    this.select = function(data){
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
            this.map.selectionChanged(data);
        }
        else {
            this.map.selectionChanged([]);
        }
    };

    this.filter = function(data){
        this.display(data);
    };

    this.rise = function(id){
        this.map.riseLayer(id);
    };
    
};
