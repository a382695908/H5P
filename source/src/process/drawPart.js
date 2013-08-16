Process.prototype.drawPart = function(img, transparent) {
	
	var data = this.data,
		update = this.update.bind(this),
		prev = document.getElementById('prev'),
		prevContext = prev.getContext('2d'),
		next = document.getElementById('next'),
		nextContext = next.getContext('2d');


	// 设置页面画布大小
	prev.width = img.width;
	prev.height = img.height;
	next.width = img.width;
	next.height = img.height;

	// 绘制页面图片
	prevContext.drawImage(img, 0, 0);
	nextContext.drawImage(transparent, 0, 0);
}