/**
 * @class DataObject
 * Implementation for data object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

/**
 * abstract class with all features needed for user interaction and informations to the data object
 * @param {String} name the name of the data object
 * @param {String} description description of the data object
 * @param {int} weight weight of the given object
 * 
 * @constructor
 */
DataObject = function(name, description, weight, tableContent){

    this.name = name;
    this.description = description;
    this.weight = weight;
    this.tableContent = tableContent;

    this.status = false;
    this.percentage = 0;
	this.hoverSelect = false;
    
};

DataObject.prototype = {

    /**
     * sets the selection-percentage of the data object
     * @param {float} percentage sets the percentage value (p); it describes the ratio to the actual selection <br>
     * p = 0 if this data object is unselected, p = 1 if it is selected and 0 < p < 1 if its in a feather range 
     */
    setPercentage: function(percentage){
        if (this.percentage == percentage) 
            this.status = false;
        else {
            this.percentage = percentage;
            this.status = true;
        }
    },
    
    /**
     * sets the object to a hover selection status
     * @param {boolean} hover bool value that tells if an object is hovered or not
     */
    setHover: function(hover){
    	this.hoverSelect = hover;
    	if( this.percentage != 1 ){
    		this.status = true;
    	} 
    },
    
    setIndex: function(index){
    	this.index = index;
    }
    
};

/**
 * map object class
 * @param {String} place place of the data object
 * @param {float} lon longitude value of the given place 
 * @param {float} lat latitude value of the given place
 * @param {int} weight weight of the map object
 * 
 * @constructor
 */
MapObject = function(name, description, locations, weight, tableContent){

	this.base = DataObject;
	this.base(name, description, weight, tableContent);

	this.locations = locations;

	this.placeDetails = [];
	for( var i=0; i<this.locations.length; i++ ){
		this.placeDetails.push(this.locations[i].place.split("/"));
	}

	this.getLatitude = function(locationId){
		return this.locations[locationId].latitude;
	}

	this.getLongitude = function(locationId){
		return this.locations[locationId].longitude;

	}

	this.getPlace = function(locationId,level){
		if( level >= this.placeDetails[locationId].length ){
			return this.placeDetails[locationId][this.placeDetails[locationId].length-1];
		}
		return this.placeDetails[locationId][level];
	}
    
};

MapObject.prototype = new DataObject;

/**
 * time object class
 * @param {Date} timeStart start time of the data object
 * @param {Date} timeEnd end time of the data object
 * @param {int} granularity granularity of the given time
 * @param {int} weight weight of the time object
 * 
 * @constructor
 */
TimeObject = function(name, description, timeStart, timeEnd, granularity, weight){

	this.base = DataObject;
	this.base(name, description, weight);

	this.timeStart = timeStart;
    this.timeEnd = timeEnd;
	this.granularity = granularity;
    
};

TimeObject.prototype = new DataObject;
   
/**
 * returns the string representation of the objects time
 * @return the string representation of the objects time
 */
TimeObject.prototype.getTimeString = function(){
	if( this.timeStart != this.timeEnd ){
		return ( SimileAjax.DateTime.getTimeString(this.granularity,this.timeStart)+" - "+SimileAjax.DateTime.getTimeString(this.granularity,this.timeEnd));
	}
	else {
		return SimileAjax.DateTime.getTimeString(this.granularity,this.timeStart)+"";
	}
};

/**
 * class that contains all given information of an object with spatial and temporal information
 * @param {String} name name of the data object
 * @param {String} description description of the data object
 * @param {String} place place of the data object
 * @param {float} lon longitude value of the given place 
 * @param {float} lat latitude value of the given place
 * @param {Date} timeStart start time of the data object
 * @param {Date} timeEnd end time of the data object
 * @param {int} granularity granularity of the given time
 * @param {int} weight weight of the time object
 * 
 * @constructor
 */
MapTimeObject = function(name, description, locations, dates, weight, tableContent){

	this.base = DataObject;
	this.base(name, description, weight, tableContent);

	this.locations = locations;

	this.placeDetails = [];
	for( var i=0; i<this.locations.length; i++ ){
		this.placeDetails.push(this.locations[i].place.split("/"));
	}

	this.getLatitude = function(locationId){
		return this.locations[locationId].latitude;
	}

	this.getLongitude = function(locationId){
		return this.locations[locationId].longitude;
	}

	this.getPlace = function(locationId,level){
		if( level >= this.placeDetails[locationId].length ){
			return this.placeDetails[locationId][this.placeDetails[locationId].length-1];
		}
		return this.placeDetails[locationId][level];
	}

	this.dates = dates;

	this.getDate = function(dateId){
		return this.dates[dateId].date;
	}

	this.getTimeGranularity = function(dateId){
		return this.dates[dateId].granularity;
	}
    
};

MapTimeObject.prototype = new DataObject;

/**
 * returns the string representation of the objects time
 * @return the string representation of the objects time
 */
MapTimeObject.prototype.getTimeString = function(){
	if( this.timeStart != this.timeEnd ){
		return ( SimileAjax.DateTime.getTimeString(this.granularity,this.timeStart)+" - "+SimileAjax.DateTime.getTimeString(this.granularity,this.timeEnd));
	}
	else {
		return SimileAjax.DateTime.getTimeString(this.granularity,this.timeStart)+"";
	}
};
