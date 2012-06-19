function TableWrapper(){

	this.initialize = function(div){
		this.table = new TableWidget(this,div);
	};

    var wrapper = this;

    Publisher.Subscribe('highlight',this,function(data){
        if( typeof wrapper.table != 'undefined' ){
             wrapper.highlight(data);
        }
    });

    Publisher.Subscribe('selection',this,function(data){
        if( typeof wrapper.table != 'undefined' ){
             wrapper.select(data);
        }
    });

    Publisher.Subscribe('filter',this,function(data){
	if( typeof wrapper.table != 'undefined' ){
		wrapper.filter(data);
	}
    });

    this.display = function(data,names) {

	if( typeof names != 'undefined' ){
		this.names = names;
	}
    	if ( data instanceof Array ) {
	    	this.table.initTable(data,this.names);
	}

    };

    this.triggerRefining = function(tableObjects) {
        if (tableObjects && tableObjects.length > 0) {
	    Publisher.Publish('filter',tableObjects,null);
        }
    };

    this.triggerSelection = function(tableObjects) {
	Publisher.Publish('selection',tableObjects,this);
    };

    this.triggerHighlight = function(tableObjects) {
	Publisher.Publish('highlight',tableObjects,this);
    };

    this.rise = function(id){
	Publisher.Publish('rise',id);
    };

    this.highlight = function(data) {
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
            this.table.highlightChanged(data);
        }
        else {
            this.table.highlightChanged([]);
        }
    };

    this.select = function(data){
        if (data == undefined) {
            return;
        }
        if (data.length > 0) {
            this.table.selectionChanged(data);
        }
        else {
            this.table.selectionChanged([]);
        }
    };

    this.filter = function(data){
        this.display(data);
    };

};
