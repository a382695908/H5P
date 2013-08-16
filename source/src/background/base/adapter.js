/*
 * 图片大小适配、转换成canvas
 * @param img {image|canvas}
 */
function Adapter(img){

	var maxPixel = 480000, // 转换的最大图片像素
		width = img.width,
		height = img.height,
	    rate = width / height,
	    countPixel = width * height,
	    canvas,
	    context,
	    floor = Math.floor;

	// 判断是否需要进行像素缩放
	if(countPixel > maxPixel) {
		height = floor(Math.sqrt(maxPixel / rate));
	    width = floor(height * rate);
	};

	// 创建画布将图片绘制上去
	canvas = document.createElement('canvas');
	context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	context.drawImage(img, 0, 0, img.width, img.height,
						   0, 0, width, height);

	this.canvas = canvas;
};
/*
 * 获取element 画布对象
 * @return {canvasElement}
 */
Adapter.prototype.get = function() {

	return this.canvas;
};