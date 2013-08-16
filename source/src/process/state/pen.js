// 注册笔刷事件
function showPen(changeColor) {

	var $pen = $('#pen'),
	    down = false,
	    nextElement = document.getElementById('next'),
	    nextCanvas = new data.bg.Canvas(nextElement);

	var penRatio = (function() {
			var	size = data.bgp.PI.part.img.getSize();
			return {
				w: size.width / window.innerWidth,
				h: size.height / window.innerHeight
			};
		})();

	$(document).mousemove(function(e) {

		var left = e.pageX - $pen.width() / 2,
			top = e.pageY - $pen.height() / 2;

		$pen.css({ left: left, top: top });
		
		if(down) {
			swapPoints(e.pageX, e.pageY);
		}

	}).mouseleave(function() {
		// 隐藏画笔
		$pen.hide();
		

	}).mouseenter(function() {
		// 设置画笔大小
		setPenSize();
		// 显示画笔
		$pen.show();
	
	}).mousedown(function(e) {
		
		down = true;

		swapPoints(e.pageX, e.pageY);

	}).mouseup(function() {
		// 设置透明层记录
		data.bgp.setTransparent(nextElement);
		down = false;
	});

	function setPenSize() {

		var penSize = data.bgp.getPenSize(),
			width = penSize / penRatio.w,
			height = penSize / penRatio.h,
			radius = width > height ? width / 2 : height / 2;

		$pen.css({
			width: width,
			height: height,
			borderRadius: radius
		});
	}

	var	brushData = data.bgp.PI.n.getImageDataAll().data;

	function swapPoints(px, py) {
		
		px = Math.round(px * penRatio.w);
		py = Math.round(py * penRatio.h);

		var size = data.bgp.PI.part.img.getSize(),
		 	width = data.bgp.getPenSize(),
			halfWidth = Math.floor(width / 2);
		
		var p1 = {
			x : px - halfWidth,
			y : py - halfWidth
		},
		p5 = {
			x : px,
			y : py 
		};

		var points = [], i, j, x, y, r, o, index;
		// 获取像素点坐标
		for (i = 0; i < width; i++) {
			x = p1.x + i;
			if(x <= 0 || x > size.width) continue;
			for (j = 0; j < width; j++) {
				y = p1.y + j;
				if(y < 0 || y > size.height) continue;
				r = Math.sqrt(Math.pow(x - p5.x,2) + Math.pow(y - p5.y,2));
				if(r <= halfWidth){
					if(r >= halfWidth * 0.8) {
						o = 0.8;
					}else {
						o = 1;
					}
					index = ((y - 1) * size.width + (x - 1)) * 4;
					if(index > 0) {
						points.push({x: x, y: y, o: o,index: index});
					}
				}
			};
		};

		// 判断画笔类型进行绘制
		if(data.bgp.getPenType() == 'brush') {
			
			if(changeColor) {
				nextCanvas.change(points, 
					brushData, 
					data.bg.Color.toRGBA(data.bgp.PI.part.color));
			}else {
				nextCanvas.show(points, brushData);
			}
		}else {
			nextCanvas.hide(points);
		}
	};
	// 注册窗体大小调整事件
	resizeLoad();
};