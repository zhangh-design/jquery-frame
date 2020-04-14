/*com.taijue.lwh.inotifywarn = function(obj) {
	for(var property in obj) {
		this[property] = obj[property];
	}
	this.iNotify = new Notify({
		effect: 'flash',
		interval: 500,
		updateFavicon: {
			backgroundColor: "red",
			textColor: "white"
		},
	});
}
com.taijue.lwh.inotifywarn.prototype = {
	iNotifyMag: function(title){
		this.iNotify.setFavicon('!');
		this.iNotify.setTitle(title || 'hello');
		this.iNotify.setFaviconColor('white').setFaviconBackgroundColor('red');
	},
	close: function(){
		this.iNotify.setTitle();
		this.iNotify.faviconClear();
		this.iNotify.setFaviconColor('white').setFaviconBackgroundColor('green');
		this.iNotify.setFavicon('O');
	}
}*/