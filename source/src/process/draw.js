Process.prototype.draw = function(prev, next) {
	
	var data = this.data;
	
	var canvas = document.getElementById('prev'),
	 	context = canvas.getContext('2d');

	canvas.width = prev.width;
	canvas.height = prev.height;
	context.drawImage(prev, 0, 0);

	if(next){
		var opacity = data.bgp.FORM.core.opacity;
		canvas = document.getElementById('next');
		canvas.style.opacity = opacity;
		context = canvas.getContext('2d');
		canvas.width = next.width;
		canvas.height = next.height;
		context.drawImage(next, 0, 0);
	}
}