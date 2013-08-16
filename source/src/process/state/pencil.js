pencil: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get(),
		pencil = data.bgp.pencil,
		nextElement = document.getElementById('next'),
		context = nextElement.getContext('2d'),
		down, downPoint;
	// 素材画笔
	function showpencil() {

		var pencilRatio = (function() {
			var	size = data.bgp.PI.part.img.getSize();
			return {
				w: size.width / window.innerWidth,
				h: size.height / window.innerHeight
			};
		})();

		$(document).mousemove(function(e) {

			if (down) {
				var movePoint = new data.bg.Point(Math.floor(e.pageX * pencilRatio.w), Math.floor(e.pageY * pencilRatio.h));
				context.strokeStyle = '#' + pencil.color;
				context.moveTo(downPoint.x, downPoint.y);
				context.lineTo(movePoint.x, movePoint.y);
				context.stroke();
				downPoint = downPoint.reset(movePoint);
			}
	
		}).mousedown(function(e) {
			
			down = true;
			downPoint = new data.bg.Point(Math.floor(e.pageX * pencilRatio.w), Math.floor(e.pageY * pencilRatio.h));

		}).mouseup(function() {

			down = false;
			// 设置透明层记录
			data.bgp.setTransparent(nextElement);
		});

		// 注册窗体大小调整事件
		resizeLoad();
	};

	if(pencil.type == 'brush') {
	
		showpencil();
	}else {
		// 清除所有
		if(pencil.clear) {
			pencil.clear = false;
			transparent = data.bgp.PI.p.clone().get();
			data.bgp.setTransparent(transparent);
		};
		
		showPen();
	}

	// 绘制到页面上
	draw(img, transparent);
},