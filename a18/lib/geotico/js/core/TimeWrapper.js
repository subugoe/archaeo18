function TimeWrapper(){

	this.initialize = function(div,index,title){
		this.plot = new TimeWidget(this,div,index,title);
	};

    var wrapper = this;

    Publisher.Subscribe('highlight',this,function(data){
        if( typeof wrapper.plot != 'undefined' ){
             wrapper.highlight(data);
        }
    });

    Publisher.Subscribe('selection',this,function(data){
        if( typeof wrapper.plot != 'undefined' ){
             wrapper.select(data);
        }	
    });

    Publisher.Subscribe('filter',this,function(data){
	if( typeof wrapper.plot != 'undefined' ){
		wrapper.filter(data);
	}
    });

    this.display = function(data) {

    	if ( data instanceof Array ) {

       		this.plot.setStyle('graph');
    		this.plot.initTimeplot(data);

        }
    	
    };
   
    this.triggerRefining = function(timeObjects) {
        if (timeObjects && timeObjects.length > 0) {
	    Publisher.Publish('filter',timeObjects,null);
        }
    };

    this.triggerSelection = function(timeObjects) {
	Publisher.Publish('selection',timeObjects,this);
    };

    this.triggerHighlight = function(timeObjects) {
	Publisher.Publish('highlight',timeObjects,this);
    };

    this.highlight = function(data) {
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
            this.plot.highlightChanged(data);
        }
        else {
        	if (typeof(this.plot) != "undefined") {
        		this.plot.highlightChanged([]);
        	}
        }
    };

    this.select = function(data){
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
        	if (typeof(this.plot) != "undefined") {
        		this.plot.selectionChanged(data);
        	}
        }
        else {
        	if (typeof(this.plot) != "undefined") {
        		this.plot.selectionChanged([]);
        	}
        }
    };

    this.filter = function(data){
        this.display(data);
    };

};
