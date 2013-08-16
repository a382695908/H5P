Process.prototype.Medio = function() {

	function medio(id) {

		var video = document.createElement('video');
		document.getElementById(id).appendChild(video);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
								 navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		
		if(navigator.getUserMedia) {
			navigator.getUserMedia({video: true}, function(stream) {
				if(video.mozSrcObject !== undefined) {
					video.mozSrcObject = stream;
				}else {
					video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				}
			}, function(error) {
				alert('摄像头暂不可用...');
				window.close();
				throw new Error('error code:' + error.code);
			});
		}

		this._VIDEO = video;
		this._HANDLE = 0;	
	}

	medio.prototype = {

		ondraw: function(callBack) {

			this._CALLBACK = callBack;
			return this;
		},

		play: function() {

			var self = this,
				canvas = document.createElement('canvas'),
				context = canvas.getContext('2d');

			this._VIDEO.play();
			clearInterval(this._HANDLE);

			this._HANDLE = setInterval(function() {

				var width = self._VIDEO.videoWidth,
					height = self._VIDEO.videoHeight;
				
				if(width > 0 &&  height > 0) {
					canvas.width = width;
					canvas.height = height;
					context.drawImage(self._VIDEO, 0, 0);
					self._CALLBACK.bind(canvas)();
				}
			}, 30);

			return this;
		},

		pause: function() {
			this._VIDEO.pause();
			clearInterval(this._HANDLE);
			return this;
		}
	};

	return medio;
}