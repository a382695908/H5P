Process.prototype.OpenFile = function() {

	function openFile(multiple) {
		
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';//accept="image/gif, image/jpeg"
		if(multiple) {
			input.multiple = 'multiple';
		}
		this._INPUT = input;
	};

	openFile.prototype = {

		onload: function(callback) {
			
			this._INPUT.onchange = function() {

				var files = this.files,
					count = files.length,
					flag = count,
					imgList = [];

				while(count--) {
					(function(file) {
						var reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = function() {
							var img = new Image();
							img.onload = function() {
								imgList.push(this);
								if(imgList.length === flag && callback) {
									callback.bind(imgList)();
								}
								img.onload = null;
							};
							img.src = this.result;
							reader.onload = null;
						};
					})(files[count]);
				}
			}
			return this;
		},

		load: function() {
			this._INPUT.click();
			return this;
		}
	};

	return openFile;
}