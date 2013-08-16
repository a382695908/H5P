Process.prototype.state = function() {

	var data = this.data,
		update = this.update.bind(this),
		draw = this.draw.bind(this),
		drawPart = this.drawPart.bind(this),
		OpenFile = this.OpenFile(),
		Medio = this.Medio(),
	    windowScreenWidth = window.screen.width;

	function resizeLoad() {
		var handle;
		$(window).resize(function() {
			clearTimeout(handle);
			handle = setTimeout(function() {
				data.bgp.FORM.fProcess.reload();
			}, 100);
		});
	};