part: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get();

	// 显示画笔
	showPen();
	// 绘制到页面上
	drawPart(img, transparent);
},