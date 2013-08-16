/*
 * 画布类
 * @param canvas {canvasElement}
 */
function Canvas(canvas) {
	this.__canvas = canvas;
	this.__context = canvas.getContext('2d');
};
/*
 * 静态方法
 * 获取指定画布上下文，map的数据
 * @param context {context}
 * @param map {Map}
 * @return {imageData}
 */
Canvas.getImageData = function(context, map) {

	return context.getImageData(
		map.left,  map.top,
		map.width, map.height
	);
};
/*
 * 静态方法
 * 填充指定画布上下文，map的数据
 * @param context {context}
 * @param map {Map}
 * @param data {imageData}
 * @param callback {function} 可选
 */
Canvas.putImageData = function(context, map, data, callback) {

	context.putImageData(
		data,
		map.left,  map.top,
		0,0,
		map.width, map.height
	);

	if(callback) callback();
};
/*
 * 公共API
 */
Canvas.prototype = {
	/*
	 * 克隆对象返回一个新一样的新对象
	 * @return {Canvas}
	 */
	clone: function() {

		var canvas = document.createElement('canvas'),
	    context = canvas.getContext('2d'),
	    size = this.getSize();

		canvas.width = size.width;
		canvas.height = size.height;
		context.drawImage(this.__canvas, 0, 0);
		return new Canvas(canvas);
	},
	/*
	 * 绘制指定的图片到画布上
	 * @param img {image|canvas}
	 * @param alpha {int} 可选 指定绘制透明度
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	draw: function(img, alpha, callback) {

		var size = this.getSize();

		if(alpha || alpha == 0) {
			this.__context.globalAlpha = alpha;
		};

		this.__context.drawImage( 
			img, 0, 0,
			img.width,
			img.height,
			0, 0,
			size.width,
			size.height
		);

		this.__context.globalAlpha = 1;

		if(callback) callback.bind(this)();
		return this;
	},
	clip: function(img, size, point) {

		this.setSize(size);

		this.__context.drawImage(
			img, 
			point.x, 
			point.y, 
			size.width, 
			size.height,
			0, 0, 
			size.width, 
			size.height
		);
		return this;
	},
	/*
	 * 绘制指定的图片到画布上
	 * @param img {image|canvas}
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	repeatImage: function(img) {
		
		var ctx = this.getContext(),
			pat = ctx.createPattern(img, 'repeat'),
			size = this.getSize();

		ctx.rect(0, 0, size.width, size.height);
		ctx.fillStyle = pat;
		ctx.fill();
		
		return this;
	},
	/*
	 * 更换颜色
	 * @param color {string} 16进制
	 * @return {Canvas}
	 */
	changeColor: function(color) {

		color = Color.toRGBA(color);

		var imageData = this.getImageDataAll(),
			data = imageData.data,
			i, 
			lenght;

		for (i = 0, length = data.length; i < length; i += 4) {
			if(data[i + 3] != 0) {
				data[i] = color.r;
				data[i + 1] = color.g;
				data[i + 2] = color.b;
			}			
		};

		this.putImageDataAll(imageData);
		return this;
	},
	/*
	 * 获取透明画布
	 * @return {Canvas}
	 */
	transparent: function() {

		// var size = this.getSize(),
		// 	layer = new Layer(size);

		// this.draw(layer);
		var size = this.getSize(),
			map = new Map(0, 0, size.width, size.height),
			imageData = this.getImageData(map),
			data = imageData.data,
			length, i;

		for (i = 0, length = data.length ; i < length ; i += 4) {
			data[i + 3] = 0;
		};

		this.putImageData(map, imageData);
		return this;
	},
	/*
	 * 获取element 画布对象
	 * @return {canvasElement}
	 */
	get: function() {
		
		return this.__canvas;
	},
	/*
	 * 获取element 画布对象的上下文
	 * @return {context}
	 */
	getContext: function() {
		
		return this.__context;
	},
	/*
	 * 获取指定map的画布数据
	 * @param map {Map}
	 * @return {imageData}
	 */
	getImageData: function(map) {

		return this.__context.getImageData(
			map.left,  map.top,
			map.width, map.height
		);
	},
	/*
	 * 获取所有画布数据
	 * @return {imageData}
	 */
	getImageDataAll: function() {

		var size = this.getSize(),
			map = new Map(0, 0, size.width, size.height);

		return this.getImageData(map);
	},
	/*
	 * 获取当前画布的大小
	 * @return {Size}
	 */
	getSize: function() {

		var canvas = this.__canvas;

		return new Size( 
			canvas.width,
			canvas.height
		);
	},
	/*
	 * 设置当前画布的大小
	 * @param size {Size}
	 * @return {Canvas}
	 */
	setSize: function(size) {

		var canvas = this.__canvas;

		canvas.width = size.width;
		canvas.height = size.height;

		return this;
	},
	/*
	 * 绘制指定map的数据到画布上
	 * @param map {Map} 必选
	 * @param data {imageData} 必选
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	putImageData: function(map, data, callback) {

		this.__context.putImageData(
			data,
			map.left,  map.top,
			0,0,
			map.width, map.height
		);
	
		if(callback) callback.bind(this)();
		return this;
	},
	/*
	 * 绘制所有数据到画布上
	 * @param data {imageData} 必选
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	putImageDataAll: function(data, callback) {

		var size = this.getSize(),
			map = new Map(0, 0, size.width, size.height);

		return this.putImageData(map, data, callback);
	},
	/*
	 * show,hide函数的核心
	 */
	_sh_: function(points, callback, fn) {
		var size = this.getSize(),
			map = new Map(0, 0, size.width, size.height),
			imageData = this.getImageData(map),
			data = imageData.data,
			count = points.length,
			index;

			while(count--) {
				index = points[count].index;
				fn(data, index);
			}

			this.putImageData(map, imageData);

		if(callback) callback.bind(this)();
		return this;
	},
	/*
	 * 将指定的点数据和传进来的数据进行正片叠底处理
	 * @param points {Point.index} 必选
	 * @param imageData {array} 可选
	 * @param color {Color} 可选
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	change: function(points, imageData, color, callback) {

		var overlay = function(b, u, o){
			var r;
			if(b<=127.5) r=b*u / 127.5;
			else  r=255-(255-b)*(255-u) / 127.5;
			return r * o + b * (1 - o); 
		};
		
		return this._sh_(points, callback, function(data, index) {
			data[index] = overlay(imageData[index], color.r, color.a);
			data[index + 1] = overlay(imageData[index + 1], color.g, color.a);
			data[index + 2] = overlay(imageData[index + 2], color.b, color.a);
			data[index + 3] = 255;
		});
	},
	/*
	 * 将指定的点数据透明度置成255
	 * @param points {Point.index} 必选
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */
	show: function(points, imageData, callback) {

		return this._sh_(points, callback, function(data, index) {
			data[index] = imageData[index];
			data[index + 1] = imageData[index + 1];
			data[index + 2] = imageData[index + 2];
			data[index + 3] = 255;
		});
	},
	/*
	 * 将指定的点数据透明度置成0
	 * @param points {Point.index} 必选
	 * @param callback {function} 可选
	 * @return {Canvas}
	 */

	hide: function(points, callback) {

		return this._sh_(points, callback, function(data, index) {
			data[index + 3] = 0;
		});
	}
};