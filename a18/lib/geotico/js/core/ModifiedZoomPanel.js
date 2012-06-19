/**
 * @class FilterBar
 * Implementation for mofified OpenLayers.Control.ZoomPanel
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

OpenLayers.Control.ModifiedZoomPanel = OpenLayers.Class(OpenLayers.Control.Panel, {

    /**
     * Constructor: OpenLayers.Control.ZoomPanel 
     * Add the three zooming controls.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */
    initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
		this.zoomIn = new OpenLayers.Control.ZoomIn();
		this.zoomToMaxExtent = new OpenLayers.Control.ZoomToMaxExtent(),
		this.zoomOut = new OpenLayers.Control.ZoomOut();
        this.addControls([
            this.zoomIn,
            this.zoomToMaxExtent,
            this.zoomOut
        ]);
    },

    CLASS_NAME: "OpenLayers.Control.ZoomPanel"
});
