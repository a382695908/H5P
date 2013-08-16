/*
 * 图片地图类
 * @param l {int}
 * @param t {int}
 * @param w {int}
 * @param h {int}
 */
function Map(l, t, w, h) {
	this.left   = l;
	this.top    = t;
	this.width  = w;
	this.height = h;
};
/*
 * 静态方法
 * 获取指定size的数据地图
 * @param size {Size}
 * @param all {bool} 可选
 * @return {array[Map]}
 */
Map.get = function(size, all) {
	
	var loop    = 3, // 最多3组
	 	limit   = 100, // 宽高的最小值
	 	width   = size.width,
	 	height  = size.height,
	 	flag    = loop -1,
	 	mapList = [],
		l,w,h,t;

	// 宽高小于最小值不拆分
	if(all || (width <= limit && height <= limit)) {
		l = 0; t = 0; w = width; h = height;
		mapList.push(new Map(l, t, w, h));
	// 按照高拆分
	}else if(height > width) {
		var HEIGHT = Math.floor(height / loop);
		while(loop--) {
			l = 0;
			t = loop * HEIGHT;
			w = width;
			h = loop == flag ? height - flag * HEIGHT : HEIGHT;
			mapList.push(new Map(l, t, w, h));
		};
	// 按照宽拆分
	}else {
		var WIDTH = Math.floor(width / loop); 
		while(loop--){
			l = loop * WIDTH;
			t = 0;
			w = loop == flag ? width - flag * WIDTH : WIDTH;
			h = height;
			mapList.push(new Map(l, t, w, h));
		}
	}
	return mapList;
};