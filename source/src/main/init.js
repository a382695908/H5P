/*
 * 窗体打开时初始化，绘制小图
 */
require(['data', 'jquery'], function(data, $) {
	
	var img = data.bgp.PI.o,
		x = 0, 
		y = 0, 
		canvas,
		context,
		size, 
		diff, 
		width, 
		height;
	canvas = document.getElementById('currentImage');
	context = canvas.getContext('2d');

	// 绘制当前处理小图
	if(img) {
		// 重置下一张图片
		// 避免在处理时，未点击功能按钮，进行了刷新页面导致数据不一致
		data.bgp.PI.n = data.bgp.PI.p.clone();

		img = img.get();
		width = img.width;
		height = img.height;
		diff = width - height;
		size = width;

		if(diff > 0) {
			x = Math.floor(diff / 2);
			size = height;
		}else if(diff < 0) {
			y = Math.floor((- diff) / 2);
			size = width;
		}

		context.drawImage(
			img, x, y,
			size,
			size,
			0, 0,
			85, 85
		);

		$('#topText').text('当前处理图片');
	}else {

		img = new Image();
		img.onload = function() {
			img.onload = null;
			context.drawImage(
				img, 0, 0,
				180,
				180,
				0, 0,
				85, 85
			);
		}
		img.src = '../images/thumb180.jpg';
	}

});