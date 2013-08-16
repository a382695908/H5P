/*
 * 图片资源加载类
 */
function LoadImage() {};
/*
 * 公共API
 */
LoadImage.prototype = {
	/*
	 * 注册图片加载完成事件
	 * @param callback {function}
	 * @return {LoadImage}
	 */
	onload: function(callback) {
		
		this._CALLBACK = callback;
		return this;
	},
	/*
	 * 开始加载指定的img资源
	 * @param urls {array|string}
	 * @return {LoadImage}
	 */
	load: function(urls) {

		var self = this,
		    count, imgList, loop,
		    img;
		this._CALLBACK = this._CALLBACK || function() {};
		// 判断是否为数组,多图片
		if(typeof urls == 'object'){
	
			count = urls.length;
			imgList = [];
			loop = 0;
			
			urls.forEach(function(url, index) {
			
				(function (url, index) {
					var img = new Image();
					img.onload = function() {
						this.onload = null;
						loop++;
						imgList[index] = this;
			
						if(loop == count) {
							self._CALLBACK.bind(imgList)();
						};
					};
					img.src = url;
				} )(url, index)
				
			} );
		// 单图片加载
		}else if(typeof urls == 'string') {
	
			img = new Image();
			img.onload = function() {
				this.onload = null;
				self._CALLBACK.bind(this)();
			};
			img.src = urls;
		}
	
		return this;
	}
};