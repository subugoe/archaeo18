/**
 * @class MapDataSource
 * Implementation for MapDataSource Object, triggers binning
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

/**
 * data source to allow dynamic aggregation of spatial objects to point objects
 * @param {OpenLayers.Map} olMap the underlying OpenLayers map
 *
 * @constructor
*/
function MapDataSource(olMap,placeIndex){

	this.olMap = olMap;
	this.circleSets = [];
	this.binning = new Binning(olMap,placeIndex);

};

MapDataSource.prototype = {

	/**
 	* initializes the MapDataSource
        * @param {MapObject[][]} mapObjects an array of map objects of different sets
	*/
	initialize: function( mapObjects ){

		if( mapObjects != this.mapObjects ){
			this.binning.reset();
			this.binning.setObjects(mapObjects);
		}
		this.mapObjects = mapObjects;

		var set = this.binning.getSet();
		this.circleSets = set.circleSets;
		this.binSets = set.binSets;
		this.hashMapping = set.hashMaps;
		this.selectionHash = set.selectionHashs;

	},

	getObjectsByZoom: function(){
		var zoom = Math.floor(this.olMap.getZoom());
		if( this.circleSets.length < zoom ){
			return null;
		}
		return this.circleSets[zoom];
	},

	getAllObjects: function(){
		if( this.circleSets.length == 0 ){
			return null;
		}
		return this.circleSets;
	},

	getAllBins: function(){
		if( this.binSets.length == 0 ){
			return null;
		}
		return this.binSets;
	},

	clearOverlay: function(){
		var zoom = Math.floor(this.olMap.getZoom());
		var circles = this.circleSets[zoom];
		for( var i in circles ){
			for( var j in circles[i] ){
				circles[i][j].reset();
			}
		}
	},

	setSelection: function(mapObjects,value){
		this.clearOverlay();
		var zoom = Math.floor(this.olMap.getZoom());
		for( var i in mapObjects ){
            for( var j in mapObjects[i] ){
                var o = mapObjects[i][j];
                this.selectionHash[zoom][i][o.index] = value;
                if( value ){
                    var circle = this.hashMapping[zoom][i][o.index];
                   	circle.overlay += o.weight;
                }
			}
		}
	},

	setOverlay: function(mapObjects){
		var zoom = Math.floor(this.olMap.getZoom());
		for( var i in mapObjects ){
			var p = mapObjects[i].value;
            for( var j in mapObjects[i].objects ){
        		for( var k in mapObjects[i].objects[j] ){
                    var o = mapObjects[i].objects[j][k];
                    if( this.selectionHash[zoom][j][o.index] ){
                    	continue;
                    }
                    var circle = this.hashMapping[zoom][j][o.index];
                    if( p == 1 ){
                    	circle.overlay += o.weight;
                    }
                    else {
                    	circle.smoothness += o.weight * p;
                    }
        		}
			}
		}
	},

	size: function(){
		if( this.circleSets.length == 0 ){
			return 0;
		}
		return this.circleSets[0].length;
	},

	getCircle: function(index,id){
		var zoom = Math.floor(this.olMap.getZoom());
		return this.hashMapping[zoom][index][id];
	}

};

/**
 * describes a finally displayed point object.
 * each instance of this class corresponds to a specific place and to only one data set
 * @param {float} x the x (longitude) value of the point object
 * @param {float} y the y (latitude) value of the point object
 * @param {DataObject[]} elements array of data objects, that belong a point object instance
 * @param {int} radius the resulting radius (in pixel) of the point in the map
 * @param {int} search corresponding search index of the elements
 * @param {int} weight weight of the elements of this dpo
 *
 * @constructor
 */
CircleObject = function(originX, originY, shiftX, shiftY, elements, radius, search, weight){

    this.originX = originX;
    this.originY = originY;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.elements = elements;
    this.radius = radius;
    this.search = search;
    this.weight = weight;
    this.overlay = 0;
    this.smoothness = 0;

    this.feature;
    this.olFeature;
	this.percentage = 0;
	this.selected = false;

};

CircleObject.prototype = {

    /**
     * sets the OpenLayers point feature for this point object
     * @param {OpenLayers.Feature} pointFeature the point feature for this object
     */
    setFeature: function(feature){
        this.feature = feature;
    },

    /**
     * sets the OpenLayers point feature for this point object to manage its selection status
     * @param {OpenLayers.Feature} olPointFeature the overlay point feature for this object
     */
    setOlFeature: function(olFeature){
        this.olFeature = olFeature;
    },

    reset: function(){
    	this.overlay = 0;
    	this.smoothness = 0;
    },

    setSelection: function(s){
	this.selected = s;
    },

    toggleSelection: function(){
	this.selected = !this.selected;
    },

    setPercentage: function(){
    	if( this.weight == this.overlay ){
    		return false;
    	}
    	var percentage = this.smoothness / (this.weight-this.overlay);
    	if( percentage != this.percentage ){
    		this.percentage = percentage;
    		return true;
    	}
    	return false;
    }

};
