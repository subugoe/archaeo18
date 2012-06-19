if( typeof Publisher == 'undefined' ){

	Publisher = function() {

		var topics = new Array();

		this.Get = function(topic){
			var value = this[topic];
			if (!value) {
				value = this[topic] = [];
			}
			return value;
		};

		this.Publish = function(topic, data, publisher) {
			var subscribers = this.Get(topic);
			for( var i=0; i<subscribers.length; i++ ){
				if( subscribers[i].client != publisher ){
					subscribers[i].callback(data);
				}
			}
		};

		this.Subscribe = function(topic, subscriber, callback) {
			var subscribers = this.Get(topic);
			subscribers.push({
				client: subscriber,
				callback: callback
			});
		};

		this.Unsubscribe = function(topic, unsubscriber) {
			var subscribers = this.Get(topic);
			for( var i=0; i<subscribers.length; i++ ){
				if( subscribers[i].client == unsubscriber ){
					subscribers.splice(i,1);
					return;
				}
			}
		};

		return this;

	}();

}
