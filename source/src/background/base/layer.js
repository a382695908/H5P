/*
 * 创建指定大小空白画布类
 * @param size {Size}
 */
function Layer(size) {

	var canvas = document.createElement('canvas');
	canvas.width = size.width;
	canvas.height = size.height;

	this._canvas = canvas;
};
/*
 * 获取element 画布对象
 * @return {canvasElement}
 */
Layer.prototype.get = function() {

	return this._canvas;
};