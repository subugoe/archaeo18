/**
 * @class MapControl
 * Impelentation for MapControl Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

function MapControl(stiMap,button,label,onActivate,onDeactivate){

	var control = this;
	this.button = button;
	this.enabled = true;
	this.activated = false;
	this.label = label;

	if( this.button != null ){
		$(this.button).addClass( label + 'Deactivated' );
		$(this.button).attr("title", STIStatic.getString(STIStatic.language,label)); //vhz
		$(this.button).click(function(){
			control.checkStatus();
		});
	}

	this.checkStatus = function(){
		if( control.enabled ){
			if( typeof stiMap.activeControl != 'undefined' ){
				if( control.activated ){
					control.deactivate();
				}
				else {
					stiMap.activeControl.deactivate();
					control.activate();
				}
			}
			else {
				control.activate();
			}
		}
	};

	this.setButtonClass = function(removeClass,addClass){
		if( this.button != null ){
			$(this.button).removeClass( label + removeClass );
			$(this.button).addClass( label + addClass );
			$(this.button).attr("title", STIStatic.getString(STIStatic.language,label));
		}
	};

	this.disable = function(){
		this.enabled = false;
		this.setButtonClass('Deactivated', 'Disabled');
	};
	
	this.enable = function(){
		this.enabled = true;
		this.setButtonClass('Disabled', 'Deactivated');
	};

	this.activate = function(){
		onActivate();
		this.activated = true;
		this.setButtonClass('Deactivated', 'Activated');
		stiMap.activeControl = this;
	};

	this.deactivate = function(){
		onDeactivate();
		this.activated = false;
		this.setButtonClass('Activated', 'Deactivated');
		stiMap.activeControl = undefined;
	};

};
