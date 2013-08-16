partChange: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get();
		
	// 显示画笔
	showPen(true);
	// 绘制到页面上
	drawPart(img, transparent);
},